import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { useHistory } from "react-router-dom";
import { commonStyles } from "../commonStyles";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {
    getContactTitles,
    getGendersList,
} from "../../assets/commonAssets.js";
import * as Yup from "yup";
import {
    updateFirebaseUser,
    uploadFilesToFirebase,
    deleteUploadedFileByUrl,
} from "../../actions/actions";
import { Formik } from "formik";
import ImageCropper from '../ImageCropper';
import CustomSnackbar from '../CustomSnackbar'
import CustomCircularProgress from "../CustomCircularProgress";

const CONTACT_TITLES = getContactTitles();
const GENDERS_LIST = getGendersList();


const UserSchema = Yup.object().shape({
    title: Yup.string().trim().required("Title is required"),
    gender: Yup.string().trim().required("Gender is required"),
    first_name: Yup.string().trim().required("First Name is required"),
    last_name: Yup.string().trim().required("Last Name is Required"),
    id_number: Yup.string().trim().min(8, 'Too Short').required("Id Number is Required"),
    primary_email: Yup.string().trim().email("Invalid Email").required("Primary Email is Required"),
    other_email: Yup.string().trim().email("Invalid Email"),
    personal_phone_number: Yup.string().trim().min(10, 'Too Short').required("Personal Phone Number is Required"),
    work_phone_number: Yup.string().trim().min(10, 'Too Short').required("Work Phone Number is Required"),
});

const UpdatePasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Too Short!")
        .max(20, "We prefer an insecure system, try a shorter password.")
        .required("Pasword is Required"),
    confirm_password: Yup.string()
        .required("Confirm Password Required")
        .test("passwords-match", "Passwords must match", function (value) {
            return this.parent.password === value;
        }),
});

let UserInputForm = (props) => {
    let { handleItemSubmit } = props;
    const userToShow = props.userToShow ? props.userToShow : {};
    const userValues = {
        id: userToShow.id,
        gender: userToShow.gender || "",
        title: userToShow.title || "",
        id_number: userToShow.id_number || '',
        first_name: userToShow.first_name || '',
        last_name: userToShow.last_name || '',
        primary_email: userToShow.primary_email || '',
        other_email: userToShow.other_email || '',
        personal_phone_number: userToShow.personal_phone_number || '',
        work_phone_number: userToShow.work_phone_number || '',
        user_avatar_url: userToShow.user_avatar_url || '',
        user_image: '',
    }
    const history = useHistory();
    let classes = commonStyles();

    return (
        <div>
            <Formik
                initialValues={userValues}
                enableReinitialize
                validationSchema={UserSchema}
                onSubmit={async (values, { setStatus }) => {
                    try {
                        const user = {
                            id: values.id,
                            title: values.title,
                            gender: values.gender,
                            id_number: values.id_number,
                            primary_email: values.primary_email,
                            other_email: values.other_email,
                            first_name: values.first_name,
                            last_name: values.last_name,
                            personal_phone_number: values.personal_phone_number,
                            work_phone_number: values.work_phone_number,
                        };
                        //first upload the image to firebase
                        if (values.user_image && values.user_image.data) {
                            //if the user had previously had a file avatar uploaded
                            // then delete it here
                            if (values.user_avatar_url) {
                                //delete file
                                await deleteUploadedFileByUrl(values.user_avatar_url);
                            }
                            //upload the first and only image in the contact images array
                            var fileDownloadUrl = await uploadFilesToFirebase(values.user_image)
                            user.user_avatar_url = fileDownloadUrl;
                        }
                        await handleItemSubmit(user, "users")
                        setStatus({ sent: true, msg: "Details saved successfully!" })
                    } catch (error) {
                        setStatus({ sent: false, msg: `Error! ${error}.` })
                    }
                }}
            >
                {({
                    values,
                    status,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <form
                        className={classes.form}
                        noValidate
                        method="post"
                        id="userPersonalInfoInputForm"
                        onSubmit={handleSubmit}
                    >
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                            direction="column"
                            spacing={2}
                        >
                            {
                                status && status.msg && (
                                    <CustomSnackbar
                                        variant={status.sent ? "success" : "error"}
                                        message={status.msg}
                                    />
                                )
                            }
                            {
                                isSubmitting && (<CustomCircularProgress open={true} dialogTitle="Saving profile..." />)
                            }
                            <Grid
                                justify="center"
                                container
                                item
                                direction="column"
                                spacing={2}
                            >
                                <Grid item>
                                    <Typography>Personal Info</Typography>
                                </Grid>
                                <Grid
                                    item
                                    container
                                    justify="center"
                                    spacing={4}
                                    alignItems="center"
                                >
                                    <Grid key={1} item>
                                        <Avatar
                                            alt="User Image"
                                            src={
                                                values.user_image ? values.user_image.data
                                                    : values.user_avatar_url
                                            }
                                            className={classes.largeAvatar}
                                        />
                                    </Grid>
                                    {
                                        values.file_to_load_url &&
                                        <ImageCropper open={true} selectedFile={values.file_to_load_url}
                                            setCroppedImageData={(croppedImage) => {
                                                setFieldValue('file_to_load_url', '');
                                                setFieldValue('user_image', croppedImage);
                                            }} cropHeight={160} cropWidth={160} />
                                    }
                                    <Grid key={2} item>
                                        <Box>
                                            <input onChange={(event) => {
                                                const selectedFile = event.currentTarget.files[0]
                                                //remove the object then push a copy of it with added image object
                                                setFieldValue("file_to_load_url", selectedFile);
                                            }} accept="image/*" className={classes.fileInputDisplayNone} id={"user-image-input"} type="file" />
                                            <label htmlFor={"user-image-input"}>
                                                <IconButton color="primary" aria-label="upload picture" component="span">
                                                    <PhotoCamera />
                                                </IconButton>
                                            </label>
                                            <Box>{values.user_avatar_url || values.user_image ? "Change Photo" : "Add Photo"}</Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            required
                                            select
                                            name="title"
                                            label="Title"
                                            id="title"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.title}
                                            error={errors.title && touched.title}
                                            helperText={touched.title && errors.title}
                                        >
                                            {CONTACT_TITLES.map((contact_title, index) => (
                                                <MenuItem key={index} value={contact_title}>
                                                    {contact_title}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            required
                                            select
                                            name="gender"
                                            label="Gender"
                                            id="gender"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.gender}
                                            error={errors.gender && touched.gender}
                                            helperText={touched.gender && errors.gender}
                                        >
                                            {GENDERS_LIST.map((gender_type, index) => (
                                                <MenuItem key={index} value={gender_type}>
                                                    {gender_type}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            required
                                            id="first_name"
                                            name="first_name"
                                            label="First Name"
                                            value={values.first_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.first_name && touched.first_name}
                                            helperText={touched.first_name && errors.first_name}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="last_name"
                                            name="last_name"
                                            label="Last Name"
                                            required
                                            value={values.last_name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.last_name && touched.last_name}
                                            helperText={touched.last_name && errors.last_name}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item sm>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        id="id_number"
                                        name="id_number"
                                        label="ID Number"
                                        required
                                        value={values.id_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.id_number && touched.id_number}
                                        helperText={touched.id_number && errors.id_number}
                                    />
                                </Grid>
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="personal_phone_number"
                                            name="personal_phone_number"
                                            label="Personal Phone Number"
                                            required
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={touched.personal_phone_number && errors.personal_phone_number}
                                            error={errors.personal_phone_number && touched.personal_phone_number}
                                            value={values.personal_phone_number}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            id="work_phone_number"
                                            name="work_phone_number"
                                            label="Work Phone Number"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            helperText={touched.work_phone_number && errors.work_phone_number}
                                            error={errors.work_phone_number && touched.work_phone_number}
                                            value={values.work_phone_number}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="primary_email"
                                            label="Primary Email"
                                            id="primary_email"
                                            required
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.primary_email}
                                            error={errors.primary_email && touched.primary_email}
                                            helperText={touched.primary_email && errors.primary_email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            name="other_email"
                                            label="Other Email"
                                            id="other_email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.other_email}
                                            error={errors.other_email && touched.other_email}
                                            helperText={touched.other_email && errors.other_email}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/** end of user details grid **/}
                            <Grid
                                item
                                container
                                direction="row"
                                className={classes.buttonBox}
                            >
                                <Grid item>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<SaveIcon />}
                                        form="userPersonalInfoInputForm"
                                        disabled={isSubmitting}
                                    >
                                        Save
									</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
            <Formik
                initialValues={{ password: '', confirm_password: '' }}
                enableReinitialize
                validationSchema={UpdatePasswordSchema}
                onSubmit={async (values, { resetForm, setStatus }) => {
                    try {
                        await updateFirebaseUser({ uid: userToShow.id, userProfile: { password: values.password } })
                        resetForm({});
                        setStatus({ sent: true, msg: "Password updated successfully!" })
                    } catch (error) {
                        setStatus({ sent: false, msg: `Error! ${error}.` })
                    }
                }}
            >
                {({
                    values,
                    status,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form
                        className={classes.form}
                        method="post"
                        id="changePasswordForm"
                        noValidate
                        onSubmit={handleSubmit}
                    >
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                            direction="column"
                        >
                            {
                                status && status.msg && (
                                    <CustomSnackbar
                                        variant={status.sent ? "success" : "error"}
                                        message={status.msg}
                                    />
                                )
                            }
                            {
                                isSubmitting && (<CustomCircularProgress open={true} dialogTitle="Updating password..." />)
                            }
                            <Grid
                                justify="center"
                                container
                                item
                                direction="column"
                                spacing={2}
                            >
                                <Grid item>
                                    <Typography>Change Password</Typography>
                                </Grid>
                                <Grid item container direction="row" spacing={2}>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            required
                                            type="password"
                                            variant="outlined"
                                            name="password"
                                            label="New Password"
                                            id="password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.password}
                                            error={errors.password && touched.password}
                                            helperText={touched.password && errors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm>
                                        <TextField
                                            fullWidth
                                            type="password"
                                            required
                                            variant="outlined"
                                            name="confirm_password"
                                            label="Confirm New Password"
                                            id="confirm_password"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.confirm_password}
                                            error={errors.confirm_password && touched.confirm_password}
                                            helperText={touched.confirm_password && errors.confirm_password}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/** end of user details grid **/}
                            <Grid
                                item
                                container
                                direction="row"
                                className={classes.buttonBox}
                            >
                                <Grid item>
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        size="medium"
                                        startIcon={<SaveIcon />}
                                        form="changePasswordForm"
                                        disabled={isSubmitting}
                                    >
                                        Update
									    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        size="medium"
                                        startIcon={<CancelIcon />}
                                        onClick={() => history.goBack()}
                                        disableElevation
                                    >
                                        Cancel
									    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default UserInputForm;
