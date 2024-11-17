import React from 'react';

export default function FriendsScreen() {
  return (
    <div style={styles.container}>
      <p style={styles.text}>Friends Screen</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: '100vh',
  },
  text: {
    fontSize: '24px',
    fontWeight: '600',
  },
};