import React from 'react';

export default function HomeScreen() {
  return (
    <div style={styles.container}>
      <p style={styles.text}>Home Screen</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  text: {
    fontSize: '24px',
    fontWeight: '600',
  },
};