import Button from "@material-ui/core/Button";
import React, { useState } from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { readXlsxFile } from "../assets/PrintingHelper";
import PropTypes from 'prop-types';
import { handleItemFormSubmit } from '../actions/actions'
import { connect } from "react-redux";
import CustomCircularProgress from "./CustomCircularProgress";

function ImportItemsBtn(props) {
    const { disabled, text, savingUrl, baseObjectToAddProperties, handleItemSubmit } = props
    const [isSaving, setSaving] = useState(false);
    return (
        <div>
            {
                isSaving && (<CustomCircularProgress dialogTitle="Uploading..." open={true} />)
            }
            <input
                accept=".xls,.xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                style={{ display: "none" }}
                id="contained-button-file"
                type="file"
                onChange={(event) => {
                    const files = event.target.files
                    if (files.length) {
                        const file = files[0];
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            try {
                                var fileData = e.target.result;
                                const dataToSave = readXlsxFile(fileData)
                                //since there is no error after reading the data,
                                // show that we are uploading the data
                                setSaving(true);
                                dataToSave.map(async dataItem => {
                                    if (baseObjectToAddProperties) {
                                        Object.assign(dataItem, baseObjectToAddProperties)
                                    }
                                    return await handleItemSubmit(dataItem, savingUrl)
                                })
                            } catch (error) {
                                console.log("Error during uploading items => ", error)
                            } finally {
                                setTimeout(() => { setSaving(false) }, 1000)
                            }
                        };
                        reader.readAsBinaryString(file)
                    }
                }}
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span"
                    disabled={disabled} startIcon={<CloudUploadIcon />}>
                    {text ? text : "Upload"}
                </Button>
            </label>
        </div>
    );
}

ImportItemsBtn.propTypes = {
    savingUrl: PropTypes.string.isRequired,
}


const mapDispatchToProps = (dispatch) => {
    return {
        handleItemSubmit: (item, url) => dispatch(handleItemFormSubmit(item, url)),
    };
};

export default connect(null, mapDispatchToProps)(ImportItemsBtn);
