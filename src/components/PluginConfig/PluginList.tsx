import * as React from "react";
import {Box, Button, CheckBox} from "grommet";
import {Link} from "react-router-dom";

interface GeneralConfigProps {
  updateConfig: (e: React.SyntheticEvent) => Promise<void>
  config: {
    plugins: Record<string, {
      enabled: boolean
    }>
  }
}

const PluginList: React.FC<GeneralConfigProps> = ({ updateConfig, config}) => {
  const { plugins } = config

  return (
    <div>
      <Box background="dark-3">
        {Object.entries(plugins).map(([name, plugin]) => (
          <Button key={name} hoverIndicator>
            <Box pad={{ horizontal: 'medium', vertical: 'small' }}>
              <Link to={name}>{name}</Link>
              <CheckBox checked={plugin?.enabled}></CheckBox>
            </Box>
          </Button>
        ))}
      </Box>
    </div>
  )
}

export default PluginList
