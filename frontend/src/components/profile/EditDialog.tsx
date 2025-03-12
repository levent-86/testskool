import {
  Avatar,
  Button, Checkbox, Dialog, DialogActions,
  DialogContent, DialogTitle,
  FormControl, FormHelperText,
  InputLabel, ListItemText,
  MenuItem, Select, SelectChangeEvent,
  Skeleton, Stack, TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useUserData } from '../../hooks/useUserData';
import api from '../../services/api';
import { ENDPOINTS } from '../../constants/endpoints';
import { title } from '../../utils/title';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import styled from '@emotion/styled';
import { PageMessages } from '../PageMessages';
import { ContentType } from '../../constants/headers';

interface EditTypes {
  open: boolean;
  handleClose: () => void;
}

interface Subject {
  name: string;
  id: number;
}

interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  about?: string;
  profile_picture?: string;
  is_teacher?: boolean;
  is_student: boolean;
  subject?: Subject[];
  date_joined?: string;
}

export const EditDialog: React.FC<EditTypes> = ({ open, handleClose }) => {
  const { userData } = useUserData() as { userData: User };

  // State variables - Datas to send
  const [first_name, setFirstname] = useState<string>('');
  const [last_name, setLastname] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [subject, setSubject] = useState<string[]>([]);
  const [profile_picture, setProfilePicture] = useState<File | null>(null);

  // State variables - Datas taken
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectMessage, setSubjectMessage] = useState<string>('');

  // State variables - Loadings / Previews / Messages
  const [isSubjectsLoading, setIsSubjectsLoading] = useState<boolean>(true);
  const [picturePreview, setPicturePreview] = useState<string>('');
  const [pictureMessage, setPictureMessage] = useState<string>('');

  // First name handling
  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data: string = e.target.value;
    setFirstname(data);
  };

  // Last name handling
  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data: string = e.target.value;
    setLastname(data);
  };

  // About handling
  const handleAbout = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data: string = e.target.value;
    setAbout(data);
  };

  // Select/option handler
  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;

    // Make sure the incoming values from SelectChangeEvent are string[]
    if (Array.isArray(value)) {
      setSubject(value);
    };
  };

  // Profile picture button styles
  // https://mui.com/material-ui/react-button/?srsltid=AfmBOorOo7jHec0vF_J2QfE-VRB4I1_juF_z7_ggEKAm-Nzt5HeGrJLC#file-upload
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleProfilePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPictureMessage('');
    const picture = e.target.files;
    if (picture && picture[0].size > 307200) {
      return setPictureMessage('Please select an image under 300 KB.');
    } else if (picture) {
      setProfilePicture(picture[0]);

      const reader = new FileReader();
      reader.onload = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(picture[0]);
    }
  };



  // Fetch subfects from server
  const fetchSubjects = async (): Promise<void> => {
    try {
      const response = await api.get(ENDPOINTS.SUBJECT_LIST);

      setSubjects(response.data);
      setIsSubjectsLoading(false);

    } catch (error) {
      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };

  // useEffect for Fetch subjects
  useEffect(() => {
    // Fetch subjects only if isTeacher is true
    if (userData?.is_teacher && open) {
      fetchSubjects();
    } else {
      // Clean the subjects and validations if isTeacher is false
      setSubject([]);
      setSubjects([]);
    }

  }, [open, userData]);

  //! is it enough to prevent render when data is empty?
  if (!userData) return undefined;


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('about', about);
    if (subject.length > 0) subject.forEach((s) => { formData.append('subject', s); });
    if (profile_picture) formData.append('profile_picture', profile_picture);

    try {
      const response = await api.put(ENDPOINTS.EDIT_PROFILE, formData, {
        headers: {
          'Content-Type': ContentType.FORM_DATA
        }
      });

    } catch (error) {
      // Show error only on development mode
      if (process.env.NODE_ENV === 'development') {
        console.error('Request failed:', error);
      }
    }
  };

  return <>
    {
      pictureMessage &&
      <PageMessages message={pictureMessage} severity='warning' />
    }

    <Dialog
      open={open}
      onClose={handleClose}
      scroll='body'
      closeAfterTransition={false}
    >
      <DialogTitle>Edit your profile</DialogTitle>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogContent>
          <Stack spacing={2}>

            {/* Avatar */}
            <Stack alignItems='center'>
              <Avatar
                id='avatar-prev'
                src={picturePreview || ''}
                alt='Preview of selected image.'
                sx={{ width: '80px', height: '80px' }}
                aria-describedby='avatar-helper-text'
              />
              <FormHelperText id='avatar-helper-text'>Maximum 300 KB</FormHelperText>
            </Stack>

            {/* Profile picture */}
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<AddPhotoAlternateIcon />}
            >
              Select an image
              <VisuallyHiddenInput
                type="file"
                onChange={handleProfilePicture}
                accept="image/jpeg,image/png,image/gif"

              />
            </Button>

            <TextField label="First Name" variant="filled" value={first_name} onChange={handleFirstName} fullWidth />
            <TextField label="Last Name" variant="filled" value={last_name} onChange={handleLastName} fullWidth />
            <TextField label="About" variant="filled" value={about} onChange={handleAbout} fullWidth multiline />
            {
              userData.is_teacher && (
                isSubjectsLoading ? (
                  <Skeleton data-testid='skeleton' variant="rectangular" height={60} />) :
                  <FormControl variant="filled">
                    <InputLabel id="subjects">Subject(s)</InputLabel>
                    <Select<string[]>
                      labelId="subjects"
                      id="simple-select-filled"
                      multiple
                      value={subject}
                      onChange={handleSelectChange}
                      renderValue={(selected) => selected.join(', ')}
                      autoWidth
                    >
                      {
                        subjects.map(s => (
                          <MenuItem key={s.id} value={s.name}>
                            <Checkbox checked={subject.includes(s.name)} />
                            <ListItemText primary={title(s.name)} />
                          </MenuItem>
                        ))
                      }
                    </Select>
                    <FormHelperText error={true}>{subjectMessage}</FormHelperText>
                  </FormControl>
              )
            }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  </>;
};
