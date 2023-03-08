import React, { useState } from 'react'
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const ImageCropper = ({ open, selectedFile, setCroppedImageData }) => {

    const [cropper, setCropper] = useState()
    const [image, setImage] = useState()

    const fileToLoad = selectedFile;

    const reader = new FileReader();
    reader.onloadend = () => {
        setImage(reader.result)
    };
    reader.readAsDataURL(fileToLoad);

    const getCropData = () => {
        if (typeof cropper !== "undefined") {
            const croppedImageData = cropper.getCroppedCanvas().toDataURL()
            fileToLoad.data = croppedImageData
            setCroppedImageData(fileToLoad)

        }
    };

    const handleClose = () => {
        setCroppedImageData("")
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <Cropper
                            style={{ height: "100%", width: "100%" }}
                            initialAspectRatio={1}
                            src={image}
                            viewMode={0.5}
                            guides={true}
                            minCropBoxHeight={30}
                            minCropBoxWidth={30}
                            background={false}
                            responsive={true}
                            autoCropArea={0.5}
                            checkOrientation={false}
                            onInitialized={(instance) => {
                                setCropper(instance);
                            }}
                        />
                    </Grid>
                    <Grid item container justify="center" direction="row" spacing={2}>
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="contained"
                                size="medium"
                                onClick={() => handleClose()}
                                disableElevation
                            >
                                Cancel
					        </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                color="primary"
                                variant="contained"
                                size="medium"
                                onClick={() => getCropData()}
                            >
                                Crop Image
					        </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog >
    )
}

export default ImageCropper;