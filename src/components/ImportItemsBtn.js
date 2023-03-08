import Button from "@material-ui/core/Button";
import React from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { readXlsxFile } from "../assets/PrintingHelper";
import PropTypes from 'prop-types';
import { handleItemFormSubmit } from '../actions/actions'
import { connect } from "react-redux";

function ImportItemsBtn(props) {
    const { disabled, text, savingUrl, baseObjectToAddProperties, handleItemSubmit } = props
    return (
        <div>
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
                            var fileData = e.target.result;
                            const dataToSave = readXlsxFile(fileData)
                            dataToSave.forEach(async dataItem => {
                                if (baseObjectToAddProperties) {
                                    Object.assign(dataItem, baseObjectToAddProperties)
                                }
                                await handleItemSubmit(dataItem, savingUrl)
                            })
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
