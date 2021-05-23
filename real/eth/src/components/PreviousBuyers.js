import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
// import { useSubstrate } from './substrate-lib';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function PreviousBuyers ({
    previousBuyers
}) {
  return (
    // https://etherscan.io
    // <Grid.Column>
    <>
      <h1 style={{
        textAlign: "center",
      }}>Previous Buyers</h1>
      <Table celled striped size='small'>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3}>
              <strong>Address</strong>
            </Table.Cell>
          </Table.Row>
          {previousBuyers.map((account, index) =>
            <Table.Row key={`${account}${index}`} >
              <Table.Cell width={3}>
                <div style={{
                  display: "flex",
                }}>
                  <span style={{ display: 'flex', alignItems: "center", minWidth: '10rem' }}>
                  {/* <span style={{ display: 'inline-block', minWidth: '10rem' }}> */}
                    {account}
                  </span>
                  {/* https://etherscan.io */}
                  <CopyToClipboard text={account}>
                    <Button
                      style={{
                        marginLeft: "auto",
                        marginRight: 0,
                      }}
                      circular
                      compact
                      size='mini'
                      color='blue'
                      icon='copy outline'
                    />
                  </CopyToClipboard>
                </div>
                
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </>
    // </Grid.Column>
  );
}