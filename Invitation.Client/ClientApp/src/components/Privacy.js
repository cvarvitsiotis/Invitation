import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import CardWithStyle from './overrides/CardWithStyle';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  button: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing.unit * 3
  }
});

class Privacy extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader align="center" title="Privacy Policy" />
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Information Collected</Typography>
          <Typography paragraph>
            When you sign into your Google account from this site, Google asks you if you want to grant this site access to your profile and contacts.<br />
            You can revoke this site&#39;s access anytime through Google.
          </Typography>
          <Typography variant="subtitle1" gutterBottom>How Information Is Used</Typography>
          <Typography paragraph>
            This site uses that information to send the messages that you specify.
          </Typography>
          <Typography variant="subtitle1" gutterBottom>Information Shared</Typography>
          <Typography paragraph>
            Your profile and contacts are not visible to other users of this site.<br />
            This data is shared with Microsoft Azure, the service used to host this site&#39;s server.<br />
            The phone numbers and messages are shared with Twilio, the service used to send the messages.
          </Typography>
          <div className={classes.button}>
            <Button color="primary" size="large" component={Link} to="/events">Home</Button>
          </div>
        </CardContent>
      </CardWithStyle>
    );
  }
}

export default withStyles(styles)(Privacy);