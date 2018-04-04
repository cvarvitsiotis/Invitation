import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import Button from 'material-ui/Button';

const styles = theme => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: grey[200],
    borderTop: `1px solid ${grey[300]}`,
    height: '10vh'
  },
  copyright: {
    marginLeft: theme.spacing.unit * 3
  },
  gitHub: {
    marginRight: theme.spacing.unit * 1,
    opacity: 0.40,
    '&:hover': {
      opacity: 0.75
    }
  }
});

class Footer extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Typography variant="body1" color="textSecondary" className={classes.copyright}>&copy; 2018 Invititation</Typography>
        <Button href="https://github.com/cvarvitsiotis/Invitation" size="small" className={classes.gitHub}>
          <img src="/GitHub-Mark-32px.png" width="20" height="20" />
        </Button>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);