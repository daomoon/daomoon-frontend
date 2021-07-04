import React, { useState } from "react";
import { WalletOutlined, QrcodeOutlined, SendOutlined, KeyOutlined } from "@ant-design/icons";
import { Tooltip, Spin, Modal, Button, Typography, Drawer } from "antd";
import { Box, Heading, Text, List, OrderedList, ListItem, HStack, Image } from "@chakra-ui/react";
import QR from "qrcode.react";
import { parseEther } from "@ethersproject/units";
import { useUserAddress } from "eth-hooks";
import { Transactor } from "../helpers";
import Address from "./Address";
import Account from "./Account";
import Balance from "./Balance";
import AddressInput from "./AddressInput";
import EtherInput from "./EtherInput";
import { ethers } from "ethers";


/*

  Wallet UI for sending, receiving, and extracting the burner wallet

  <Wallet
    address={address}
    provider={userProvider}
    ensProvider={mainnetProvider}
    price={price}
  />

*/

export default function Wallet(props) {
  const signerAddress = useUserAddress(props.provider);
  const selectedAddress = props.address || signerAddress;

  const [open, setOpen] = useState();
  const [qr, setQr] = useState();
  const [amount, setAmount] = useState();
  const [toAddress, setToAddress] = useState();
  const [pk, setPK] = useState()
  const [walletOpen, setWalletOpen] = useState(false)


  const providerSend = props.provider ? (
    <Tooltip title="Wallet">
      <WalletOutlined
        onClick={() => {
          setOpen(!open);
        }}
        style={{
          padding: 7,
          color: props.color ? props.color : "black",
          cursor: "pointer",
          fontSize: 21,
          verticalAlign: "middle",
          transform: "rotate(-90deg)",
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "rotate(0deg)"
          }
        }}
      />
    </Tooltip>
  ) : (
    ""
  );

  function toggleWallet() {
    setWalletOpen(!walletOpen);
  }

  let display;
  let receiveButton;
  let privateKeyButton;
  let daoTokensList;
  let yieldInfo;
  let walletFooter = [];

  if (qr) {
    display = (
      <div>
        <div>
          <Text copyable>{selectedAddress}</Text>
        </div>
        <QR
          value={selectedAddress}
          size="450"
          level="H"
          includeMargin
          renderAs="svg"
          imageSettings={{ excavate: false }}
        />
      </div>
    );
    receiveButton = (
      <Button
        key="hide"
        onClick={() => {
          setQr("");
        }}
      >
        <QrcodeOutlined /> Hide
      </Button>
    );
    privateKeyButton = (
      <Button key="hide" onClick={() => { setPK(selectedAddress); setQr("") }}>
        <KeyOutlined /> Private Key
      </Button>
    )
  } else if (pk) {

    let pk = localStorage.getItem("metaPrivateKey")
    let wallet = new ethers.Wallet(pk)

    if (wallet.address !== selectedAddress) {
      display = (
        <div>
          <b>*injected account*, private key unknown</b>
        </div>
      )
    } else {

      let extraPkDisplayAdded = {}
      let extraPkDisplay = []
      extraPkDisplayAdded[wallet.address] = true
      extraPkDisplay.push(
        <div style={{ fontSize: 16, padding: 2, backgroundStyle: "#89e789" }}>
          <a href={"/pk#" + pk}>
            <Address minimized={true} value={wallet.address} ensProvider={props.ensProvider} /> {wallet.address.substr(0, 6)}
          </a>
        </div>
      )
      for (var key in localStorage) {
        if (key.indexOf("metaPrivateKey_backup") >= 0) {
          console.log(key)
          let pastpk = localStorage.getItem(key)
          let pastwallet = new ethers.Wallet(pastpk)
          if (!extraPkDisplayAdded[pastwallet.address] /*&& selectedAddress!=pastwallet.address*/) {
            extraPkDisplayAdded[pastwallet.address] = true
            extraPkDisplay.push(
              <div style={{ fontSize: 16 }}>
                <a href={"/pk#" + pastpk}>
                  <Address minimized={true} value={pastwallet.address} ensProvider={props.ensProvider} /> {pastwallet.address.substr(0, 6)}
                </a>
              </div>
            )
          }
        }
      }


      display = (
        <Box>
          <b>Private Key:</b>

          <div>
            <Text copyable>{pk}</Text>
          </div>

          <hr />

          <i>Point your camera phone at qr code to open in
           <a target="_blank" href={"https://xdai.io/" + pk} rel="noopener noreferrer">burner wallet</a>:
         </i>
          <QR value={"https://xdai.io/" + pk} size={"450"} level={"H"} includeMargin={true} renderAs={"svg"} imageSettings={{ excavate: false }} />

          <Text style={{ fontSize: "16" }} copyable>{"https://xdai.io/" + pk}</Text>

          {extraPkDisplay ? (
            <div>
              <h3>
                Known Private Keys:
             </h3>
              {extraPkDisplay}
              <Button onClick={() => {
                let currentPrivateKey = window.localStorage.getItem("metaPrivateKey");
                if (currentPrivateKey) {
                  window.localStorage.setItem("metaPrivateKey_backup" + Date.now(), currentPrivateKey);
                }
                const randomWallet = ethers.Wallet.createRandom()
                const privateKey = randomWallet._signingKey().privateKey
                window.localStorage.setItem("metaPrivateKey", privateKey);
                window.location.reload()
              }}>
                Generate
             </Button>
            </div>
          ) : ""}

        </Box>
      )
    }

    receiveButton = (
      <Button key="receive" onClick={() => { setQr(selectedAddress); setPK("") }}>
        <QrcodeOutlined /> Receive
      </Button>
    )
    privateKeyButton = (
      <Button key="hide" onClick={() => { setPK(""); setQr("") }}>
        <KeyOutlined /> Hide
      </Button>
    )
  } else {
    const inputStyle = {
      padding: 10,
    };

    display = (
      <Box backgroundColor="white">
        <div style={inputStyle}>
          <AddressInput
            autoFocus
            ensProvider={props.ensProvider}
            placeholder="to address"
            value={toAddress}
            onChange={setToAddress}
          />
        </div>
        <div style={inputStyle}>
          <EtherInput
            price={props.price}
            value={amount}
            onChange={value => {
              setAmount(value);
            }}
          />
        </div>
      </Box>
    );
    receiveButton = (
      <Button
        key="receive"
        onClick={() => {
          setQr(selectedAddress);
          setPK("");
        }}
      >
        <QrcodeOutlined /> Receive
      </Button>
    );
    privateKeyButton = (
      <Button key="hide" onClick={() => { setPK(selectedAddress); setQr("") }}>
        <KeyOutlined /> Private Key
      </Button>
    );
    const daoTokens = [
      {
        "chainId": 1,
        "address": "0x30cf203b48edaa42c3b4918e955fed26cd012a3f",
        "name": "MetaGame",
        "symbol": "SEED",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/13099/small/V8phEz8V.png?1612854078"
      },
      {
        "chainId": 1,
        "address": "0xfb5453340c03db5ade474b27e68b6a9c6b2823eb",
        "name": "MetaFactory",
        "symbol": "ROBOT",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/13517/small/MF_Robot_200px.png?1609312481"
      },
      {
        "name": "DAOHaus",
        "address": "0xf2051511b9b121394fa75b8f7d4e7424337af687",
        "symbol": "HAUS",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://assets.coingecko.com/coins/images/14551/small/jN3kkqke_400x400.png?1616990048"
      },
      {
        "name": "Opolis",
        "address": "0x1482295Df16e7761d128B9823B61785D43CA038B",
        "symbol": "WORK",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://pbs.twimg.com/profile_images/1350145905438175234/ojsHt9O6_400x400.jpg"
      },
      {
        "chainId": 1,
        "address": "0xd56dac73a4d6766464b38ec6d91eb45ce7457c44",
        "name": "Panvala",
        "symbol": "PAN",
        "decimals": 18,
        "logoURI": "https://assets.coingecko.com/coins/images/9543/small/pan-logo.png?1568674599"
      },
      {
        "name": "GitCoin",
        "address": "0xde30da39c46104798bb5aa3fe8b9e0e1f348163f",
        "symbol": "GTC",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://assets.coingecko.com/coins/images/15810/small/gitcoin.png?1621992929"
      },
      {
        "name": "DeepWork",
        "address": "0xf15401e41b3c2f84a7dc8d90ba5889cbeb4475a3",
        "symbol": "DEEP",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://deepwork.studio/wp-content/uploads/2020/07/deep-work-logo.svg"
      },
      {
        "name": "DAOMoon",
        "address": "0xf15401e41b3c2f84a7dc8d90ba5889cbeb4475a3",
        "symbol": "dMOON",
        "decimals": 18,
        "chainId": 1,
        "logoURI": "https://deepwork.studio/wp-content/uploads/2020/07/deep-work-logo.svg"
      }
    ]


    daoTokensList = (
      <Box mt={4} >
        <Heading as="h4" size="sm">Your tokens</Heading>
        <OrderedList sx={{
          listStyle: "none",
          ml: 0,
          "li": {
            d: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid",
            borderColor: "gray.500",
            fontSize: "14px",
            py: 4,
            px: 3,
            ml: 0,
            "&:first-of-type": {
              fontSize: "18px"
            }
          }
        }}>
          <ListItem>
            <Box maxW="50px" flex="0" mr="15px" fontSize="25px" >🌖</Box>
            <Box as="span" flex="1">{"dMOON"}</Box>
            <Box as="span" flex="0">300</Box>
          </ListItem>
          {daoTokens && daoTokens.map(token => (
            token.symbol !== "dMOON" && (
              <ListItem>
                <Image src={token.logoURI} alt={token.name} maxW="30px" flex="0" mr="15px" />
                <Box as="span" flex="1">{token.symbol}</Box>
                <Box as="span" flex="0">300</Box>
              </ListItem>
            )
          ))}
        </OrderedList>
      </Box>
    );

    yieldInfo = (
      <Box mt={4}>
        <Heading as="h4" size="sm">Your yield</Heading>
        <Text>Yield</Text>
      </Box>
    );

    walletFooter = [
      privateKeyButton, receiveButton,
      <Button
        key="submit"
        type="primary"
        disabled={!amount || !toAddress || qr}
        loading={false}
        onClick={() => {
          const tx = Transactor(props.provider);

          let value;
          try {
            value = parseEther("" + amount);
          } catch (e) {
            // failed to parseEther, try something else
            value = parseEther("" + parseFloat(amount).toFixed(8));
          }

          tx({
            to: toAddress,
            value,
          });
          setOpen(!open);
          setQr();
        }}
      >
        <SendOutlined /> Send
          </Button>,
      <Box>
        {display}
      </Box>
    ];

  }

  return (
    <Box as="span">
      {providerSend}
      <Drawer
        visible={open}
        onClose={() => { setOpen(false) }}
        width={500}
        closable
        onClose={() => {
          setQr();
          setPK();
          setOpen(!open);
        }}
        bodyStyle={{
          position: "relative",
          backgroundColor: "rgba(0, 0, 0, 1)",
          color: "silver",
          padding: 0,
          overflowY: "hidden"
        }}
      >
        <Box d="flex" flexFlow="column wrap" alignContent="stretch" h="100vh" overflowY="hidden">
          <HStack backgroundColor="rgba(255,255,255,0.1)" flex={0} borderBottom="1px solid silver" minH="60px" w="100%" pl="25px">
            {props.address ? <Address value={props.address} ensProvider={props.mainnetProvider} blockExplorer={props.blockExplorer} color="silver" /> : "Connecting..."}
            <Balance address={props.address} provider={props.localProvider} dollarMultiplier={props.price} />
          </HStack>
          <Box d="flex" flexFlow="column wrap" flex={1} h="auto" padding="24px" minW="100%">
            {daoTokensList}
            {yieldInfo}
          </Box>
          <Box
            // position="absolute"
            // bottom={0}
            // left={0}
            flex={0}
          // border="1px solid red"
          // maxH={walletOpen ? "200px" : "50px"}
          // // transform={walletOpen ? "translate3d(0, 90px, 0)" : "translate3d(0, 0, 0)"}
          // transition="all 0.3s ease-in-out"
          >
            <Button onClick={toggleWallet}>Open wallet</Button>
            {walletFooter && walletFooter.map(item => item)}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
