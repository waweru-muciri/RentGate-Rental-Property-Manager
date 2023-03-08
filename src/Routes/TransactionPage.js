import React from 'react'
import { Grid} from "@material-ui/core";
import PageHeading from "../components/PageHeading";
import Layout from '../components/myLayout';
import { connect } from 'react-redux'
import TransactionInputForm from "../components/transactions/TransactionInputForm";
import { withRouter } from 'react-router-dom';


let TransactionPage = (props) =>  {
	let transactionToEditId = props.match.params.transactionId
	let transactionToEdit = props.transactions.find(({ id }) => id === transactionToEditId)
	let pageTitle = transactionToEditId ? "Edit Transaction" : "New Transaction"		

    return (
        <Layout pageTitle="Transaction Details">
			<Grid container justify="center" direction="column">
				<Grid item key={2}>
            		<PageHeading paddingLeft={2} text={pageTitle} />
				</Grid>
				<Grid container direction="column" justify="center" item key={3}>
			    	<TransactionInputForm transactionToEdit={transactionToEdit} />
				</Grid>
				</Grid>
				</Layout>
			);
		}

const mapStateToProps = (state) => {
    return {
        transactions: state.transactions, error: state.error
    }
}


TransactionPage = connect(
    mapStateToProps,
)(TransactionPage)


export default withRouter(TransactionPage);
