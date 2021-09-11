/* eslint-disable react/prop-types */
import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import { Column } from 'simple-flexbox';
import { color } from '../theme/color';

const useStyles = createUseStyles({
  '@keyframes loadingSpin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },
  container: {
    backgroundColor: ({ noTransparency, backgroundColor }) => {
      if (backgroundColor) {
        return noTransparency ? backgroundColor : `${backgroundColor}A0`;
      }
      return noTransparency ? color.veryDarkGrayishBlue : `${color.veryDarkGrayishBlue}A0`;
    },
    height: '100%',
    minHeight: ({ fullScreen }) => (fullScreen ? '100vh' : '100%'),
    width: ({ fullScreen }) => (fullScreen ? '100vw' : '100%'),
    position: ({ fullScreen }) => (fullScreen ? 'fixed' : 'relative'),
    top: 0,
    left: 0,
    zIndex: ({ zIndex }) => zIndex
  },
  loading: {
    border: () => `16px solid ${color.lightGrayishBlue}`,
    borderRadius: '50%',
    borderTop: () => `16px solid #ff6634`,
    width: 120,
    height: 120,
    animationName: '$loadingSpin',
    animationTimingFunction: 'linear',
    animationDuration: '2s',
    animationIterationCount: 'infinite'
  },
  loadingSpan: {
    color: 'white',
    marginTop: 10,
    fontSize: 18
  }
});

function LoadingComponent({
  backgroundColor,
  children,
  fullScreen,
  height,
  hideText,
  loading,
  noTransparency,
  width,
  zIndex
}) {
  const theme = useTheme();
  const classes = useStyles({
    theme,
    fullScreen,
    noTransparency,
    backgroundColor,
    zIndex
  });
  return (
    <div style={{ position: 'relative', height, width }}>
      {loading && (
        <Column className={classes.container} horizontal="center" vertical="center">
          <div className={classes.loading} />
          {!hideText && <span className={classes.loadingSpan}>Loading...</span>}
        </Column>
      )}
      {children || <div />}
    </div>
  );
}

LoadingComponent.defaultProps = {
  fullScreen: true,
  zIndex: 10
};

export default LoadingComponent;