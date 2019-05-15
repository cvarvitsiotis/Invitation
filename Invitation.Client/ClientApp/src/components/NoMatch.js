import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/styles';
import CardWithStyle from './overrides/CardWithStyle';

const styles = () => ({
  button: {
    display: 'flex',
    justifyContent: 'center'
  }
});

class NoMatch extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader align="center" title="Page Not Found" />
        <CardContent>
          <div className={classes.button}>
            <Button color="primary" size="large" component={Link} to="/events">Home</Button>
          </div>
        </CardContent>
      </CardWithStyle>
    );
  }
}

export default withStyles(styles)(NoMatch);