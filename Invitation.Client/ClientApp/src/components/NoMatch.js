import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { CardContent, CardHeader } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
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
            <Button variant="raised" color="primary" component={Link} to="/events">Home</Button>
          </div>
        </CardContent>
      </CardWithStyle>
    );
  }
}

export default withStyles(styles)(NoMatch);