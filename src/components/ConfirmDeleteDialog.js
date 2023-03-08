import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';


const ConfirmDeleteDialog = (props) => {
    const { open, setDeleteConfirmOpen, onConfirm } = props;
    return (
        <Dialog
            open={open}
            onClose={() => setDeleteConfirmOpen(false)}
            aria-labelledby="confirm-dialog"
        >
            <DialogTitle id="confirm-dialog">Confirm Delete Action</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Do you really want to delete this item?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={() => setDeleteConfirmOpen(false)}
                    color="primary"
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                        setDeleteConfirmOpen(false);
                        onConfirm();
                    }}
                    color="secondary"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ConfirmDeleteDialog;