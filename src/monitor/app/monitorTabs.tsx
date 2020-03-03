import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CommandAction } from "../command";
import ServerPanel from "./monitorPanel";
import MonitorPanel from "./monitorPanel";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  server: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, server, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any, disabled: boolean) {
  return {
    id: `vertical-tab-${index}`,
    disabled: disabled,
    "aria-controls": `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: 224
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

interface MonitorTableProps {
  serverList: any[];
  current: string;
}

export default function MonitorTabs(props: MonitorTableProps) {
  const serverList = props.serverList;
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [current, setCurrent] = React.useState("");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  if (current !== props.current) {
    let newValue = undefined;

    serverList.forEach((element, index) => {
      if (element.id === props.current) {
        setCurrent(element.id);
        newValue = index;
      }
    });

    if (newValue) {
      setValue(newValue);
    }
  }

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Servidores"
        className={classes.tabs}
      >
        {serverList.map((server, index) => (
          <Tab label={server.name} {...a11yProps(index, server.isConnected)} />
        ))}
      </Tabs>
      {serverList.map((server, index) => (
        <TabPanel value={value} index={index} server={server.id}>
          <MonitorPanel server={server} />
        </TabPanel>
      ))}
    </div>
  );
}
