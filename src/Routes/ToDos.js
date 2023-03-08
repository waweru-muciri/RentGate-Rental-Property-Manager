import React from 'react'
import Layout from '../components/myLayout';
import PageHeading from '../components/PageHeading';
import ToDoInputForm from '../components/to-dos/EventInputForm.js';
import { Grid, } from "@material-ui/core";
import { handleItemFormSubmit } from '../actions/actions'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction"; 
// must manually import the stylesheets for each plugin
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";


let InputForm = ({
    values,
	match,
    touched,
    errors,
    handleChange,
    handleBlur,
	setFieldValue,
    handleSubmit,
    isSubmitting, }) => {

	const [open, toggleOpen] = React.useState(false);
	const [events, setEvents] = React.useState([
	 {id: 1, title: 'Event 1', start: new Date(), end: new Date() }, 
	 {id: 2, title: 'Event 2', start: new Date(), end: new Date()},
	]);

	const [eventToShow, setEventToShow] = React.useState(null);

	const handleEventDrop = (info) => {
		let updatedEvent = {...info.event.extendedProps, start: info.event.start, end: info.event.end};
		setEventToShow(updatedEvent);
		console.log('Updated event from drop => ', updatedEvent);
	}

	const  handleClose = () => {
		setEventToShow({});
		toggleOpen(!open);
	}

	const handleEventClick = ({event}) => {
		setEventToShow(event);
		handleClose();
		//console.log(event);
	}

	const handleDateClick = (arg) => {
		setEvents([...events, {title: 'Another one', start: arg.date }]);
		handleClose();
		//console.log(event);
	}

    return (
			<Layout pageTitle={'To-Dos'}>
				<Grid container spacing={3} justify="space-evenly"
                alignItems="center">
						<Grid item xs={12} sm={12} md={12} lg={12}>
									<PageHeading text="To-Dos" />
						</Grid>
						<Grid item> 	
							<FullCalendar defaultView='dayGridMonth'
							header={{
								  left: "prev,next today",
										  center: "title",
										  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
								}}
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin ]}
							events={events}
							editable={true}
							eventDrop={handleEventDrop}
							eventClick={handleEventClick}
			        	    dateClick={handleDateClick}
					
							/>
							<ToDoInputForm eventToShow={eventToShow} open={open} handleClose={handleClose} />
						</Grid>
				</Grid>
			</Layout>
			);
		}

const mapStateToProps = (state) => {
    return {
        todos: state.todos, error: state.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: todo => {
            dispatch(handleItemFormSubmit(todo, 'todos'))
        },
    }
}


InputForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(InputForm)


export default withRouter(InputForm);
