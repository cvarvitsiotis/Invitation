import React from 'react';
import { Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';

const MyLink = props => {
  return <Link to="/events" {...props} />;
};

class NoMatch extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Typography variant="display1" gutterBottom align="center">Oops. Whaaaaaaaaat?</Typography>
        <Grid container justify="center">
          <Grid item>  
            <Button variant="raised" color="primary" component={MyLink}>Home</Button>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default NoMatch;