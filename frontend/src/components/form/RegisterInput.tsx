import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Checkbox, FilledInput, FormControl, FormControlLabel,
  FormGroup, FormHelperText, IconButton, InputAdornment,
  InputLabel, ListItemText, MenuItem, Select, Skeleton,
  Switch, Typography, SelectChangeEvent
} from '@mui/material';
import { useState } from 'react';
import { title } from '../../utils/title';



interface Subjects {
  id: number;
  name: string;
};


interface RegisterProps {
  confirm: string;
  setConfirm: (confirm: string) => void;
  confirmMessage?: string | null;
  is_teacher: boolean;
  setIsTeacher: (teacher: boolean) => void;
  isTeacherMessage: string | null;
  isSubjectsLoading: boolean | undefined;
  filledSelect: boolean;
  setFilledSelect: (filledSelect: boolean) => void;
  subject: string[];
  setSubject: (subject: string[]) => void;
  subjects: Subjects[];
  subjectMessage: string | null;
}



const RegisterInput: React.FunctionComponent<RegisterProps> = ({
  confirm, setConfirm, confirmMessage,
  is_teacher, setIsTeacher, isTeacherMessage,
  isSubjectsLoading, filledSelect, setFilledSelect,
  subject, setSubject, subjects, subjectMessage
}) => {  
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [filledConfirm, setFilledConfirm] = useState<boolean>(true);


  const handleClickShowConfirm = (): void => setShowConfirm((show) => !show);

  const handleMouseDownConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpConfirm = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // Confirm validation
  const handleFilledConfirm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    setFilledConfirm(value.length > 0);
    setConfirm(value);
  };

  // Select/option handler
  const handleSelectChange = (e: SelectChangeEvent<string[]>) => {
    const value = e.target.value;

    // Make sure the incoming values from SelectChangeEvent are string[]
    if (Array.isArray(value)) {
      setSubject(value);
    };

    // Select validation
    setFilledSelect(value.length > 0);
  };


  return <>
    <FormControl variant="filled" required error={!filledConfirm}>
      <InputLabel htmlFor="filled-adornment-confirm-password">Confirm Password</InputLabel>
      <FilledInput
        value={confirm}
        onChange={handleFilledConfirm}
        error={!filledConfirm}
        required
        id="filled-adornment-confirm-password"
        type={showConfirm ? 'text' : 'password'}
        placeholder="Password Confirmation"
        inputProps={{ minLength: 8 }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={
                showConfirm ? 'hide the confirm' : 'display the confirm'
              }
              onClick={handleClickShowConfirm}
              onMouseDown={handleMouseDownConfirm}
              onMouseUp={handleMouseUpConfirm}
              edge="end"
            >
              {showConfirm ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={true}>{confirmMessage}</FormHelperText>
    </FormControl>

    {/* Switch and subject select */}
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={is_teacher}
            onChange={() => {
              setIsTeacher(!is_teacher);
            }} />
        } label="I'm a teacher!"
      />
      <FormHelperText error={true}>{isTeacherMessage}</FormHelperText>
    </FormGroup>

    {
      is_teacher && <>
        {
          isSubjectsLoading ? (
            <Skeleton data-testid='skeleton' variant="rectangular" height={60} />
          ) : (
            <FormControl required error={!filledSelect} variant="filled">
              <InputLabel id="subjects">Select Your Subject</InputLabel>
              <Select<string[]>
                labelId="subjects"
                id="simple-select-filled"
                multiple
                value={subject}
                onChange={handleSelectChange}
                error={!filledSelect}
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

        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
          You can choose more than one subject.
        </Typography>
      </>
    }
  </>;
};

export default RegisterInput;
