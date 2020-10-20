#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Deploying Chaincode CERTNET On Certification Network"
echo
CHANNEL_NAME="$1"
DELAY="$2"
LANGUAGE="$3"
VERSION="$4"
TYPE="$5"
: ${CHANNEL_NAME:="certificationchannel"}
: ${DELAY:="5"}
: ${LANGUAGE:="node"}
: ${VERSION:=1.1}
: ${TYPE="basic"}

LANGUAGE=`echo "$LANGUAGE" | tr [:upper:] [:lower:]`
ORGS="iit mhrd upgrad"
TIMEOUT=15

if [ "$TYPE" = "basic" ]; then
  CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode/"
else
  CC_SRC_PATH="/opt/gopath/src/github.com/hyperledger/fabric/peer/chaincode-advanced/"
fi

echo "Channel name : "$CHANNEL_NAME

# import utils
. scripts/utils.sh

## Install new version of chaincode on peer0 of all 3 orgs making them endorsers
echo "Installing chaincode on peer0.iit.certification-network.com ..."
installChaincode 0 'iit' $VERSION
echo "Installing chaincode on peer0.mhrd.certification-network.com ..."
installChaincode 0 'mhrd' $VERSION
echo "Installing chaincode on peer0.upgrad.certification-network.com ..."
installChaincode 0 'upgrad' $VERSION

# Instantiate chaincode on the channel using peer0.iit
echo "Instantiating chaincode on channel using peer0.iit.certification-network.com ..."
instantiateChaincode 0 'iit' $VERSION

echo
echo "========= All GOOD, Chaincode CERTNET Is Now Installed & Instantiated On Certification Network =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0
