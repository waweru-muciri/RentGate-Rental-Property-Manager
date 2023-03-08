import React from "react";
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
import moment from "moment";
import { handleItemFormSubmit, handleDelete } from "../actions/actions";

const defaultDate = moment().format('YYYY-MM-DD')

let ToDosPage = ({ currentUser, toDos, users, handleItemDelete, handleItemSubmit }) => {
	const [open, toggleOpen] = React.useState(false);

	const [eventToShow, setEventToShow] = React.useState({});

	const mappedToDos = toDos.map((event) =>
		Object.assign({}, event, {
			backgroundColor: event.extendedProps.complete_status === "true" ? "#008000" : "",
		})
	);

	const handleEventDrop = (info) => {
		let updatedEvent = {
			start: moment(info.event.start).format("YYYY-MM-DD"),
			end: moment(info.event.start).format("YYYY-MM-DD"),
			id: info.event.id,
			title: info.event.title,
			extendedProps: {...info.event.extendedProps}
		};
		handleItemSubmit( updatedEvent, "to-dos").then((response) => {
			console.log("Updated event successfully!", updatedEvent);
		});
	};

	const handleClose = () => {
		toggleOpen(!open);
	};

	const handleEventClick = ({ event }) => {
		const clickedEvent = {
			title: event.title,
			id: event.id,
			description: event.extendedProps.description,
			reminder_date: event.extendedProps.reminder_date,
			complete_status: event.extendedProps.complete_status,
			start: event.start ? moment(event.start).format("YYYY-MM-DD") : defaultDate,
			end: event.end ? moment(event.end).format("YYYY-MM-DD") : defaultDate,
			allDay: event.allDay,
		};
		setEventToShow(clickedEvent);
		handleClose();
		//console.log(event);
	};

	const handleEventResize = ({ event }) => {
		const clickedEvent = {
			title: event.title,
			id: event.id,
			description: event.extendedProps.description,
			reminder_date: event.extendedProps.reminder_date,
			complete_status: event.extendedProps.complete_status,
			start: event.start ? moment(event.start).format("YYYY-MM-DD") : defaultDate,
			end: event.end ? moment(event.end).format("YYYY-MM-DD") : defaultDate,
			allDay: event.allDay,
		};
		setEventToShow(clickedEvent);
		handleClose();
		//console.log(event);
	};

	const handleDateClick = (arg) => {
		setEventToShow({});
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
				<Grid item xs={12} sm={12} md={12} lg={12}>
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
						events={mappedToDos}
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
		error: state.error,
		users: state.users,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
        handleItemDelete: (itemId, url) => dispatch(handleDelete( itemId, url)),
		handleItemSubmit: ( item, url) => dispatch(handleItemFormSubmit(item, url)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ToDosPage);
