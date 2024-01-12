import {
  forwardRef,
  ReactElement,
  Ref,
  ReactNode,
  useState,
  SyntheticEvent,
  useEffect,
  ChangeEvent,
} from "react";
import { TransitionProps } from "@mui/material/transitions";
import MuiDialog, { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import {
  Box,
  Slide,
  Button,
  Tab,
  DialogTitle,
  DialogContent,
  Tabs,
  Typography,
  TextField,
  Grid,
  Stack,
} from "@mui/material";
import { secondAsTimer } from "@/utils/time";
import Player from "@/app/types/Player";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement<any, any>;
  },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export interface DialogProps extends MuiDialogProps {
  open: boolean;
  start: () => void;
  lastTimeElapsed: string;
  lastScore: number;
  player: string;
  handlePlayerChange: (e: ChangeEvent<HTMLInputElement>) => void;
  speed: number;
  handleSpeedChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function Dialog({
  open,
  start,
  lastTimeElapsed,
  lastScore,
  player,
  handlePlayerChange,
  speed,
  handleSpeedChange,
  ...props
}: DialogProps) {
  const [tabVal, setTabVal] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setTabVal(newValue);
  };

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        const items = data as Player[];
        setLeaderboard(items);
      });
  }, [open]);

  return (
    <MuiDialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: { backgroundColor: "#121212" },
      }}
      {...props}
    >
      <DialogTitle textAlign="center">
        {process.env.NEXT_PUBLIC_TITLE}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabVal}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="Your Score" {...a11yProps(0)} />
            <Tab label="New Game" {...a11yProps(1)} />
            <Tab label="Leaderboard" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={tabVal} index={0}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Time Elapsed</Typography>
            <Typography color="aqua" textAlign="right">
              {lastTimeElapsed}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography>Score</Typography>
            <Typography color="aqua" textAlign="right">
              {lastScore}
            </Typography>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={tabVal} index={1}>
          <Stack spacing={2}>
            <TextField
              placeholder="ex. John Doe"
              label="Your Name"
              size="small"
              variant="outlined"
              fullWidth
              value={player}
              onChange={handlePlayerChange}
            />
            <TextField
              placeholder="ex. 4"
              label="Game Speed"
              size="small"
              variant="outlined"
              fullWidth
              value={speed}
              onChange={handleSpeedChange}
              type="number"
              InputProps={{ inputProps: { min: 3, max: 20 } }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                start();
              }}
              disabled={player === "" || speed <= 0}
            >
              Play
            </Button>
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={tabVal} index={2}>
          <Stack>
            {leaderboard.map((player, i) => (
              <Grid
                container
                key={i}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid item sm={6}>
                  <Typography>{player.name}</Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography textAlign="right" color="aqua">
                    {secondAsTimer(player.time)}
                  </Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography textAlign="right" color="aqua">
                    {player.score}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </CustomTabPanel>
      </DialogContent>
    </MuiDialog>
  );
}
