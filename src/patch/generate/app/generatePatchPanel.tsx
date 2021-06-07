/*
Copyright 2021 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import * as React from 'react';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { GeneratePatchPanelAction } from '../actions';
import GeneratePatchTheme, { inputTextStyles } from '../helper/theme';
import { useMemento, IMemento, i18n } from '../helper';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  SvgIconProps,
  TextField,
  Typography,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { IGeneratePatchData, IServerFS } from '../generatePatchData';
import { Alert, TreeItem, TreeItemProps, TreeView } from '@material-ui/lab';
import { generatePathIcons } from '../helper/generatePathIcons';

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      display: 'inline',
      fontSize: '180%',
      fontWeight: 'bold',
      marginLeft: '16px',
    },
    subtitle: {
      color: 'silver',
      display: 'inline',
      marginLeft: '20px',
    },
    actions: {
      display: 'inline',
      marginRight: '8px',
      float: 'right',
    },
    actionOn: {
      borderRadius: '25px',
      border: '2px solid silver',
      boxShadow: '0 0 3px #FF0000, 0 0 5px #0000FF',
    },
  })
);

interface IGeneratePatchPanel {
  vscode: any;
  memento: any;
  initialData: IGeneratePatchData;
}

let listener = undefined;

interface ITitleProps {
  title: string;
  subtitle: string;
}

function Title(props: ITitleProps) {
  const style = useToolbarStyles();

  return (
    <>
      <div className={style.title}>{props.title}</div>
      <div className={style.subtitle}>{props.subtitle}</div>
    </>
  );
}

let memento: IMemento = undefined;

interface IEnableActions {
  generate: boolean;
}

interface RenderTree {
  id: string;
  name: string;
  directory: boolean;
  path: string;
  children?: RenderTree[];
}

const useTreeItemStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.secondary,
      '&:hover > $content': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:focus > $content, &$selected > $content': {
     //   backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
        color: 'var(--tree-view-color)',
      },
      '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
        backgroundColor: 'transparent',
      },
    },
    content: {
      color: theme.palette.text.secondary,
      borderTopRightRadius: theme.spacing(2),
      borderBottomRightRadius: theme.spacing(2),
      paddingRight: theme.spacing(1),
      fontWeight: theme.typography.fontWeightMedium,
      '$expanded > &': {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
    group: {
      marginLeft: 0,
      '& $content': {
        paddingLeft: theme.spacing(2),
      },
    },
    expanded: {},
    selected: {},
    label: {
      fontWeight: 'inherit',
      color: 'inherit',
    },
    labelRoot: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
      marginRight: theme.spacing(1),
    },
    labelText: {
      fontWeight: 'inherit',
      flexGrow: 1,
    },
  })
);

type StyledTreeItemProps = TreeItemProps & {
  bgColor?: string;
  color?: string;
  //labelIcon: React.ElementType<SvgIconProps>;
  labelInfo?: string;
  labelText: string;
};

declare module 'csstype' {
  interface Properties {
    '--tree-view-color'?: string;
    '--tree-view-bg-color'?: string;
  }
}

function StyledTreeItem(props: StyledTreeItemProps) {
  const classes = useTreeItemStyles();
  const { labelText, labelInfo, color, bgColor, ...other } = props;

  return (
    <TreeItem
      label={
        <div className={classes.labelRoot}>
          <Typography variant="body2" className={classes.labelText}>
            {labelText}
          </Typography>
          <Typography variant="caption" color="inherit">
            {labelInfo}
          </Typography>
        </div>
      }
      classes={{
        root: classes.root,
        content: classes.content,
        expanded: classes.expanded,
        selected: classes.selected,
        group: classes.group,
        label: classes.label,
      }}
      {...other}
    />
  );
}

export default function GeneratePatchPanel(props: IGeneratePatchPanel) {
  memento = useMemento(
    props.vscode,
    'GENERATE_PATCH_PANEL',
    GeneratePatchPanelAction.UpdateData,
    undefined,
    props.memento
  );

  const [subtitle, setSubtitle] = React.useState('');
  const [enableActions, setEnableActions] = React.useState<IEnableActions>({
    generate: false,
  });

  const [targetFolder, setTargetFolder] = React.useState<string>('');
  const [targetFile, setTargetFile] = React.useState<string>('');
  const [rpoMaster, setRpoMaster] = React.useState<string>('');
  const [data, setData] = React.useState<RenderTree>();
  const [waitMessage, setWaitMessage] = React.useState<boolean>(false);

  const targetFolderRef = React.useRef<HTMLTextAreaElement>();
  const targetFileRef = React.useRef<HTMLTextAreaElement>();
  const rpoMasterRef = React.useRef<HTMLTextAreaElement>();

  if (listener === undefined) {
    listener = (event: MessageEvent) => {
      const message = event.data; // The JSON data our extension sent

      switch (message.command) {
        case GeneratePatchPanelAction.UpdatePage: {
          const generatePatchData: IGeneratePatchData = message.data;

          setSubtitle(generatePatchData.serverName);
          setEnableActions({
            generate: true,
          });
          if (generatePatchData.targetFolder) {
            setTargetFolder(generatePatchData.targetFolder);
            setTargetFile(generatePatchData.targetFile);
            setRpoMaster(generatePatchData.rpoMaster);
          }
          if (generatePatchData.rootFolder) {
            setData(generatePatchData.rootFolder);
          }

          break;
        }
        default:
          console.log('***** ATTENTION: applyPatchPanel.tsx');
          console.log('\tCommand not recognized: ' + message.command);
          break;
      }
    };

    window.addEventListener('message', listener);
  }

  const findNode = (id: string, children: RenderTree[]): RenderTree => {
    let result: RenderTree = null;

    children.forEach((element: RenderTree) => {
      if (element.id == id) {
        result = element;
      } else if (element.children && element.children.length != 0) {
        const result2 = findNode(id, element.children);
        if (result2) {
          result = result2;
        }
      }
    });

    return result;
  };

  const doClickNode = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    id: string
  ) => {
    event.preventDefault();

    const currentNode: RenderTree = findNode(id, data.children);
    if (currentNode && !currentNode.name.startsWith('root')) {
      setRpoMaster(currentNode.path);
    } else {
      setRpoMaster('');
    }
  };

  const renderTree = (nodes: RenderTree) => {
    const icone = nodes.id.startsWith('root')
      ? generatePathIcons.openFolder
      : undefined;

    return (
      <StyledTreeItem
        nodeId={'node_' + nodes.id}
        labelText={nodes.name}
        onClick={(event) => doClickNode(event, nodes.id)}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </StyledTreeItem>
    );
  };

  const sendUpdateData = (action: GeneratePatchPanelAction) => {
    props.vscode.postMessage({
      action: action,
      content: {
        targetFolder: targetFolderRef.current.value,
        targetFile: targetFileRef.current.value,
        rpoMaster: rpoMasterRef.current.value,
      },
    });
  };

  const handleCancel = () => {
    sendUpdateData(GeneratePatchPanelAction.Cancel);
  };

  const handleGenerate = () => {
    setWaitMessage(true);
    sendUpdateData(GeneratePatchPanelAction.Generate);
  };

  const handleSelectFolderButtonClick = (event: any) => {
    event.preventDefault();
    sendUpdateData(GeneratePatchPanelAction.SelectFoler);
  };

  const handleTargetFolderChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setTargetFolder(event.target.value);
  };

  const handleTargetFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();

    setTargetFile(event.target.value);
  };

  const SelectFolderButton = () => (
    <IconButton onClick={handleSelectFolderButtonClick}>
      <SearchIcon />
    </IconButton>
  );

  return (
    <GeneratePatchTheme>
      <Paper variant="outlined">
        <div>
          <Title
            title={i18n.localize('GENERATE_PATCH', 'Generate Patch')}
            subtitle={subtitle}
          />
        </div>

        <Grid container spacing={2}>
          <Grid item xs={5} container>
            <Grid
              xs={12}
              container
              item
              justify="flex-end"
              alignContent="flex-start"
            >
              <FormControl fullWidth>
                <TextField
                  required={true}
                  disabled
                  margin="dense"
                  size="small"
                  fullWidth
                  label="RPO Master Location"
                  value={rpoMaster}
                  inputRef={rpoMasterRef}
                  helperText="Use the navigation tree on the side"
                />

                <TextField
                  required={true}
                  inputRef={targetFolderRef}
                  margin="dense"
                  size="small"
                  fullWidth
                  label="Ouput folder"
                  value={targetFolder}
                  onChange={handleTargetFolderChange}
                  InputProps={{ endAdornment: <SelectFolderButton /> }}
                />

                <TextField
                  inputRef={targetFileRef}
                  margin="dense"
                  size="small"
                  fullWidth
                  label="File (without extension)"
                  value={targetFile}
                  onChange={handleTargetFileChange}
                  helperText="Leave blank for default name"
                />
                {waitMessage && (
                  <Alert severity="info">
                    {i18n.localize(
                      'WARN_PROCESS',
                      'Running process. It may take some time. When the form is closed, the process is finished.'
                    )}
                  </Alert>
                )}
              </FormControl>
              <Grid xs={12} container item justify="flex-end">
                <Grid item xs={4}>
                  <Button onClick={handleCancel} color="secondary" disabled={waitMessage}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    onClick={handleGenerate}
                    color="primary"
                    disabled={waitMessage}
                  >
                    Generate
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={7} container alignContent="flex-start">
            <Grid item xs={12}>
              <Typography>Select RPO Master folder</Typography>
            </Grid>
            <Grid item xs={12}>
              <TreeView
                defaultExpanded={['node_root']}
                defaultCollapseIcon={generatePathIcons.closedFolder}
                defaultExpandIcon={generatePathIcons.openFolder}
                defaultEndIcon={<div style={{ width: 24 }} />}
              >
                {data && renderTree(data)}
              </TreeView>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </GeneratePatchTheme>
  );
}
