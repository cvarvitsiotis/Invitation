import React from 'react';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';

const styles = theme => ({
  card: {
    margin: `${theme.spacing(3)}px auto 0`,
    width: '80vw',
    [theme.breakpoints.up('md')]: {
      width: '70vw'
    }
  }
});

const CardWithStyle = props => {
  return (
    <Card className={props.classes.card}>
      {props.children ? props.children : null}
    </Card>
  );
};

export default withStyles(styles)(CardWithStyle);