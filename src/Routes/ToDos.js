import React, { useState, useEffect } from "react";
import Layout from "../components/PrivateLayout";
import PageHeading from "../components/PageHeading";
import ToDoInputForm from "../components/to-dos/ToDoInputForm.js";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// must manually import the stylesheets for each plugin
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import { handleItemFormSubmit, handleDelete, itemsFetchData } from "../actions/actions";
import { format, startOfToday } from "date-fns";

const defaultDate = format(startOfToday(), 'yyyy-MM-dd')

let ToDosPage = ({ fetchData, currentUser, toDos, users, handleItemDelete, handleItemSubmit }) => {
	const [open, toggleOpen] = useState(false);
	const [toDoItems, setToDoItems] = useState([]);
	const [eventToShow, setEventToShow] = useState({});

	useEffect(() => {
		fetchData(['to-dos']);
	}, [fetchData]);

	useEffect(() => {
		const mappedToDos = toDos.map((event) =>
			Object.assign({}, event, {
				backgroundColor: event.extendedProps.complete_status === "true" ? "#008000" : "",
			})
		);
		setToDoItems(mappedToDos);
	}, [toDos]);

	const handleEventDrop = async (info) => {
		const updatedEvent = {
			start: format(info.event.start, 'yyyy-MM-dd'),
			end: format(info.event.start, 'yyyy-MM-dd'),
			id: info.event.id,
			title: info.event.title,
			extendedProps: { ...info.event.extendedProps }
		};
		await handleItemSubmit(updatedEvent, "to-dos");
	};

	const handleClose = () => {
		toggleOpen(!open);
	};

	const handleEventClick = ({ event }) => {
		const clickedEvent = {
			title: event.title,
			id: event.id,
			assigned_to: event.extendedProps.assigned_to || null,
			description: event.extendedProps.description,
			reminder_date: event.extendedProps.reminder_date,
			complete_status: event.extendedProps.complete_status,
			start: event.start ? format(event.start, 'yyyy-MM-dd') : defaultDate,
			end: event.end ? format(event.end, 'yyyy-MM-dd') : defaultDate,
			allDay: event.allDay,
		};
		setEventToShow(clickedEvent);
		handleClose();
	};

	const handleEventResize = ({ event }) => {
		const clickedEvent = {
			title: event.title,
			id: event.id,
			assigned_to: event.extendedProps.assigned_to || null,
			description: event.extendedProps.description,
			reminder_date: event.extendedProps.reminder_date,
			complete_status: event.extendedProps.complete_status,
			start: event.start ? format(event.start, 'yyyy-MM-dd') : defaultDate,
			end: event.end ? format(event.end, 'yyyy-MM-dd') : defaultDate,
			allDay: event.allDay,
		};
		setEventToShow(clickedEvent);
		handleClose();
		//console.log(event);
	};

	const handleDateClick = (arg) => {
		setEventToShow({ start: arg.date ? format(arg.date, 'yyyy-MM-dd') : '' });
		handleClose();
	};

	return (
		<Layout pageTitle={"To-Dos"}>
			<Grid
				container
				spacing={3}
				justify="space-evenly"
				alignItems="center"
			>
				<Grid item xs={12}>
					<PageHeading text="To-Dos" />
				</Grid>
				<Grid item>
					<FullCalendar
						defaultView="dayGridMonth"
						header={{
							left: "prev,next today",
							center: "title",
							right:
								"dayGridMonth,timeGridWeek,timeGridDay,listWeek",
						}}
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							interactionPlugin,
						]}
						editable
						events={toDoItems}
						eventResize={handleEventResize}
						eventDrop={handleEventDrop}
						eventClick={handleEventClick}
						dateClick={handleDateClick}
					/>
					<ToDoInputForm
						handleItemDelete={handleItemDelete}
						currentUser={currentUser}
						handleItemSubmit={handleItemSubmit}
						users={users}
						eventToShow={eventToShow}
						setEventToShow={setEventToShow}
						open={open}
						handleClose={handleClose}
					/>
				</Grid>
			</Grid>
		</Layout>
	);
};

const mapStateToProps = (state) => {
	return {
		currentUser: state.currentUser,
		toDos: state.toDos,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		fetchData: (collectionsUrls) => dispatch(itemsFetchData(collectionsUrls)),
		handleItemDelete: (itemId, url) => dispatch(handleDelete(itemId, url)),
		handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ToDosPage);
