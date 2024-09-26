import React, { useState, useEffect, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DraftsIcon from "@mui/icons-material/Drafts";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Header from "./components/Header";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./App.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const Modal = ({
  show,
  onClose,
  onSave,
  onDelete,
  event,
  onChange,
  position,
  positionType,
  isEvent,
  triangleDirection,
}) => {
  const [errorBorderColor, setErrorBorderColor] = useState("#d6d6d6");
  if (!show) return null;

  const modalStyle = {
    position: positionType,
    top: position.top,
    left: position.left,
  };

  const handleSubmit = () => {
    if (!event.title.trim()) {
      setErrorBorderColor("#ef0c0c");
      return;
    }
    setErrorBorderColor("#d6d6d6");
    onSave();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={modalStyle}>
        <div className={`modal-triangle ${triangleDirection}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
            <g style={{ stroke: "none", fill: "black" }}>
              <path d="M 90 82.471 H 0 L 45 4.529 L 90 82.471 z M 9.909 76.75 h 70.182 L 45 15.971 L 9.909 76.75 z" />
            </g>
          </svg>
        </div>

        <div className="cross-wrap">
          <a className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </a>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={event?.title || ""}
            placeholder="Event Name"
            maxLength="30"
            onChange={(e) => onChange("title", e.target.value)}
            style={{ borderColor: errorBorderColor, fontSize: "10px" }}
          />
        </div>

        <div className="input-container">
          <input
            type="date"
            value={event?.date ? moment(event.date).format("YYYY-MM-DD") : ""}
            onChange={(e) => onChange("date", moment(e.target.value).toDate())}
          />
        </div>

        <div className="input-container">
          <input
            type="time"
            value={event?.time || "12:00"}
            onChange={(e) => onChange("time", e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }} className="input-container">
          <input
            type="color"
            className="color"
            value={event?.color || "#0000ff"}
            onChange={(e) => onChange("color", e.target.value)}
            style={{ cursor: "pointer" }}
          />
        </div>

        <div className="input-container">
          <textarea
            placeholder="event text"
            maxLength="30"
            value={event?.text || ""}
            onChange={(e) => onChange("text", e.target.value)}
          />
        </div>

        <div className="modal-buttons">
          {isEvent ? (
            <>
              <a style={{ color: "red" }} onClick={onDelete}>
                DISCARD
              </a>
              <a onClick={handleSubmit}>EDIT</a>
            </>
          ) : (
            <a
              style={{ color: "green", margin: "auto" }}
              onClick={handleSubmit}>
              SAVE
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEvent, setIsEvent] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [modalPositionType, setModalPositionType] = useState("absolute");
  const [triangleDirection, setTriangleDirection] = useState("down");
  const [currentView, setCurrentView] = useState("month");
  const [activeEventId, setActiveEventId] = useState(null);

  const viewLabels = {
    month: "Calendar View",
    week: "Week View",
    day: "Day View",
    agenda: "Agenda View",
  };

  const activeEventRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        activeEventRef.current &&
        !activeEventRef.current.contains(event.target) &&
        !event.target.closest(".modal-overlay") // Check if click is outside modal
      ) {
        // If the click is outside the active event and modal, make it inactive
        setCurrentEvent(null);
        setIsModalOpen(false);
        setIsEvent(false);
        setActiveEventId(null); // Make the event inactive
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = ({ start }) => {
    setIsEvent(false);
    const formattedTime = moment(start).format("HH:mm");

    setCurrentEvent({
      title: "",
      date: start,
      time: formattedTime,
      color: "#0000ff",
      text: "",
    });
    setModalPositionType("unset");
    setModalPosition({ top: 0, left: 0 });
    setIsModalOpen(true);
  };

  const handleEventSelect = (event, e) => {
    if (!e) return; // Add this check to avoid the error if e is undefined

    setIsEvent(true);
    setCurrentEvent(event);

    // Toggle the active event
    if (activeEventId === event.id) {
      setActiveEventId(null); // Deselect the event if it is already active
    } else {
      setActiveEventId(event.id); // Set the active event
    }

    const rect = e.target.getBoundingClientRect(); // e is now correctly the mouse event
    const modalWidth = 242;
    const modalHeight = 342;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow >= modalHeight) {
      setModalPositionType("absolute");
      setModalPosition({
        top: rect.bottom + window.scrollY + 16,
        left: rect.left + window.scrollX + rect.width / 2 - modalWidth / 2,
      });
      setTriangleDirection("down");
    } else {
      setModalPositionType("absolute");
      setModalPosition({
        top: rect.top + window.scrollY - modalHeight - 16,
        left: rect.left + window.scrollX + rect.width / 2 - modalWidth / 2,
      });
      setTriangleDirection("up");
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setCurrentEvent(null);
    setIsModalOpen(false);
    setActiveEventId(null);
  };

  const handleSaveEvent = () => {
    if (currentEvent) {
      const startTime = moment(currentEvent.date)
        .set({
          hour: moment(currentEvent.time, "HH:mm").hour(),
          minute: moment(currentEvent.time, "HH:mm").minute(),
        })
        .toDate();

      const endTime = moment(startTime).add(29, "minutes").toDate();
      const uniqueId = currentEvent.id || Date.now();

      setEvents((prevEvents) => {
        const existingEventIndex = prevEvents.findIndex(
          (evt) => evt.id === uniqueId
        );
        const newEvent = {
          ...currentEvent,
          id: uniqueId,
          start: startTime,
          end: endTime,
          color: currentEvent.color, // Ensure the color is included
        };
        if (existingEventIndex > -1) {
          const updatedEvents = [...prevEvents];
          updatedEvents[existingEventIndex] = newEvent;
          return updatedEvents;
        } else {
          return [...prevEvents, newEvent];
        }
      });
    }
  };

  const handleDeleteEvent = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((evt) => evt.id !== currentEvent.id)
    );
    handleModalClose();
  };

  const handleEventChange = (field, value) => {
    setCurrentEvent((prevEvent) => ({
      ...prevEvent,
      [field]: value,
    }));
  };

  const onEventResize = ({ event, start, end }) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.start === event.start && evt.title === event.title
          ? { ...evt, start, end }
          : evt
      )
    );
  };

  const onEventDrop = ({ event, start, end }) => {
    setEvents((prevEvents) =>
      prevEvents.map((evt) =>
        evt.start === event.start && evt.title === event.title
          ? { ...evt, start, end }
          : evt
      )
    );
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || "#0000ff";
    const isActive = activeEventId === event.id;

    return {
      style: {
        backgroundColor: isActive ? "white" : backgroundColor, // Inverted background color
        color: isActive ? backgroundColor : "white", // Inverted text color
        borderRadius: "5px",
        opacity: 0.8,
        border: `2px solid ${backgroundColor}`,
        display: "block",
        transition: "all 0.3s ease",
        // height: "35px",
      },
    };
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>IMPEKABLE</h2>
        </div>
        <div>
          <ul className="sidebar-links">
            <li>
              <a href="#">
                <HomeIcon />
                Home
              </a>
            </li>
            <li>
              <a href="#">
                <DashboardIcon />
                Dashboard
              </a>
            </li>
            <li>
              <a href="#">
                <DraftsIcon />
                Inbox
              </a>
            </li>
            <li>
              <a href="#">
                <InventoryIcon />
                Products
              </a>
            </li>
            <li>
              <a href="#">
                <CalendarMonthIcon />
                Calendar
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mainContainer">
        <Header />
        <h1 className="title">Calendar</h1>
        <div className="callendar-wrap">
          <div className="view-mode">{viewLabels[currentView]}</div>
          <DnDCalendar
            localizer={localizer}
            events={events}
            defaultView="month"
            defaultDate={moment().toDate()}
            resizable
            onEventDrop={onEventDrop}
            onEventResize={onEventResize}
            style={{ height: 500 }}
            selectable
            onSelectSlot={handleSelect}
            onSelectEvent={handleEventSelect} // Ensure this is correctly set
            onView={handleViewChange}
            eventPropGetter={eventStyleGetter}
          />

          <Modal
            show={isModalOpen}
            onClose={handleModalClose}
            onSave={handleSaveEvent}
            onDelete={handleDeleteEvent}
            event={currentEvent}
            onChange={handleEventChange}
            position={modalPosition}
            positionType={modalPositionType}
            isEvent={isEvent}
            triangleDirection={triangleDirection}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
