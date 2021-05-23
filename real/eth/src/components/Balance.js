import React from 'react';

import {
  Menu,
  Button,
  Container,
  Icon,
  Image,
  Label
} from 'semantic-ui-react';

function Balance ({
  balance
}) {
  return (
    <Menu
      attached='top'
      tabular
      style={{
        backgroundColor: '#fff',
        borderColor: '#fff',
        paddingTop: '1em',
        paddingBottom: '1em'
      }}
    >
      <Container>
        <Menu.Menu>
            <a
              style={{
                display: "flex",
                alignItems: "center",
                color: "black",
              }}

              href="https://github.com/steadylearner"
              target="_blank"
              rel='noopener noreferrer'
            >
              <Image src={`https://avatars.githubusercontent.com/u/32325099?v=4`} size={"mini"} />
              <span style={{
                fontWeight: "bold",
                marginLeft: "0.5rem",
              }}>
                Steadylearner
              </span>
            </a>
          {/* <Image src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`} size='mini' /> */}
          
        </Menu.Menu>
        <Menu.Menu position='right' style={{ alignItems: 'center' }}>
          <Button
            style={{
              marginRight: "1rem",
            }}
            circular
            size='large'
            icon='user'
            color={balance !== 0 ? 'green' : 'red'}
          />
          {/* <input style={{
            width: "25rem",
          }} value={"0xdD2FD4581271e230360230F9337D5c0430Bf44C0"} />
           */}
          <Label pointing='left'>
            <Icon name='money' color='green' />
            {balance} ETH
          </Label>
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default Balance
