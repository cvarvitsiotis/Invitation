import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import grey from 'material-ui/colors/grey';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const styles = theme => ({
  entireFooter: {
    backgroundColor: grey[200],
    borderTop: `1px solid ${grey[300]}`,
    height: '70px'
  },
  footerItems: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  copyright: {
    marginLeft: theme.spacing.unit * 3
  },
  privacy: {
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  gitHub: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
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
      <footer className={`${classes.entireFooter} ${classes.footerItems}`}>
        <Typography variant="body1" color="textSecondary" className={classes.copyright}>&copy; {new Date().getFullYear()} Invitation</Typography>
        <div className={classes.footerItems}>
          <Typography variant="body1" color="textSecondary" className={classes.privacy} component={Link} to='/privacy'>Privacy</Typography>
          <Button href="https://github.com/cvarvitsiotis/Invitation" size="small" className={classes.gitHub}>
            <img src="/GitHub-Mark-32px.png" width="20" height="20" />
          </Button>
        </div>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);