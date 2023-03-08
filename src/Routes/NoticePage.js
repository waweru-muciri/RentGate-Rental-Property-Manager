import React from "react";
import { Grid } from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from "../components/myLayout";
import { connect } from "react-redux";
import NoticeInputForm from "../components/notices/NoticeInputForm";
import { withRouter } from "react-router-dom";
import { handleItemFormSubmit } from '../actions/actions'

let NoticePage = (props) => {
    const {currentUser, notices, users, contacts, submitForm } = props;
    let noticeToEditId = props.match.params.noticeId;
    let noticeToEdit = notices.find(({ id }) => id === noticeToEditId);

    let pageTitle = noticeToEditId ? "Edit Notice" : "New Notice";

    return (
        <Layout pageTitle="Notice Details">
            <Grid container justify="center" direction="column">
                <Grid item key={1}>
                    <PageHeading paddingLeft={2} text={pageTitle} />
                </Grid>
                <Grid item key={2}>
                    <NoticeInputForm
                        submitForm={submitForm}
                        noticeToEdit={noticeToEdit}
                        users={users}
                        currentUser={currentUser}
                        contacts={contacts}
                    />
                </Grid>
            </Grid>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        notices: state.notices,
        users: state.users,
        contacts: state.contacts,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        submitForm: (user, item, itemUrl) =>
            dispatch(handleItemFormSubmit(user, item, itemUrl)),
    };
};

NoticePage = connect(mapStateToProps, mapDispatchToProps)(NoticePage);

export default withRouter(NoticePage);
