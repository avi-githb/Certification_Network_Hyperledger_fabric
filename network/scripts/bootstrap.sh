#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Setting Up Hyperledger Fabric Network"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
TIMEOUT="$4"
VERBOSE="$5"
: ${CHANNEL_NAME:="certificationchannel"}
: ${DELAY:="5"}
: ${LANGUAGE:="node"}
: ${TIMEOUT:="15"}
: ${VERBOSE:="false"}
LANGUAGE=$(echo "$LANGUAGE" | tr [:upper:] [:lower:])
COUNTER=1
MAX_RETRY=15
ORGS="iit mhrd upgrad"

if [ "$LANGUAGE" = "node" ]; then
  CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

createChannel() {
  setGlobals 0 'iit'
  if [ -z "$CORE_PEER_TLS_ENABLED" -o "$CORE_PEER_TLS_ENABLED" = "false" ]; then
    set -x
    peer channel create -o orderer.certification-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx >&log.txt
    res=$?
    set +x
  else
    set -x
    peer channel create -o orderer.certification-network.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/channel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt
    res=$?
    set +x
  fi
  cat log.txt
  verifyResult $res "Channel creation failed"
  echo "===================== Channel '$CHANNEL_NAME' created ===================== "
  echo
}

joinChannel() {

  for org in $ORGS; do
    for peer in 0 1; do
      joinChannelWithRetry $peer $org
      echo "===================== peer${peer}.${org}.certification-network.com  joined channel '$CHANNEL_NAME' ===================== "
      sleep $DELAY
      echo
    done
  done
}

## Create channel
echo "Creating channel..."
createChannel

## Join all the peers to the channel
echo "Having all peers join the channel..."
joinChannel

## Set the anchor peers for each org in the channel
echo "Updating anchor peers for IIT..."
updateAnchorPeers 0 'iit'
echo "Updating anchor peers for MHRD..."
updateAnchorPeers 0 'mhrd'
echo "Updating anchor peers for UpGrad..."
updateAnchorPeers 0 'upgrad'

echo
echo "========= All GOOD, Hyperledger Fabric Certification Network Is Now Up and Running! =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
