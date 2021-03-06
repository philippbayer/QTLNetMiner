#!/bin/bash

#########################################################
#
# This script first runs the updateInputData.sh script to
# update the input data, then uses runs the necessary
# workflows through Ondex-Mini to create each of the
# organism networks for use with QTLNetMiner.
#  
# The resulting networks can be found in the directories ./qtlnetminer/xnets/{organism}
#
# For Ondex Logging output see ondex.log.
#
# All output from echo is printed twice, one to the screen 
# with colours and the other to $LOGFILE without colours
#
#########################################################


###############  Settings  ################################

# logfile to contain the start times of each step of the update
LOGFILE="lastUpdateProgress.log"

##  Colours used for text by echo
# This provides contrast between script output and that of other commands e.g. cURL

#yellow
TXT_COL="\e[33m"

#red
TXT_COL2="\e[31m"

# we must reset color after each echo to white otherwise the output of all
# following commands will also be coloured e.g. cURL

#white
TXT_COL_RST="\e[0m"

###########################################################

##if ctrl-c detected, exit
ctrl_c(){
	exit $?
}
trap ctrl_c SIGINT


# Ondex-Mini command to which we append the path of a workflow we want to run.
ONDEXMINI="java -Xmx10G -Dondex.dir=./data -jar lib/ondex-mini-0.6.0-SNAPSHOT.jar -ubla -ptest -w"

echo -e $TXT_COL"Update Started at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Update started at: "$(date) > $LOGFILE
######## Update the source data files  ########
cd qtlnetminer
./updateInputData.sh
cd ../


########  run the workflows  ########
echo
echo
echo -e $TXT_COL"Starting "$TXT_COL2"references/Arabidopsis/Gene-GO/Gene-GO.xml"$TXT_COL" workflow at: $TXT_COL2$(date)"$TXT_COL_RST
echo "Starting references/Arabidopsis/Gene-GO/Gene-GO.xml workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/references/Arabidopsis/Gene-GO/Gene-GO.xml

echo -e $TXT_COL"Starting "$TXT_COL2"references/Arabidopsis/Arabidopsis.xml"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting references/Arabidopsis/Arabidopsis.xml workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/references/Arabidopsis/Arabidopsis.xml

echo -e $TXT_COL"Starting "$TXT_COL2"references/Plants/Plants.xml"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting references/Plants/Plants.xml workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/references/Plants/Plants.xml


# each of these workflows creates the network for one of the organisms
echo -e $TXT_COL"Starting "$TXT_COL2"Arabidopsis"$TXT_COL" Workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting Arabidopsis Workflow at: "$(date)  >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/aranet/ArabidopsisKB2013.xml

echo -e $TXT_COL"Starting "$TXT_COL2"Barley"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting Barley Workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/barnet/Barley_WGSMorex_Mips_KB2013.xml

echo -e $TXT_COL"Starting "$TXT_COL2"Poplar"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting Poplar Workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/poplarnet/Poplar_v3_KB2014.xml

echo -e $TXT_COL"Starting "$TXT_COL2"Potato"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting Potato Workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/potnet/PotatoKB2013.xml

echo -e $TXT_COL"Starting "$TXT_COL2"SolNet"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting SolNet Workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/solnet/SOLNetKB2013.xml

echo -e $TXT_COL"Starting "$TXT_COL2"Wheat"$TXT_COL" workflow at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Starting wheat workflow at: "$(date) >> $LOGFILE
$ONDEXMINI qtlnetminer/xnets/wheatnet/WheatNet_2014_Workflow.xml


echo -e $TXT_COL"Finished updating networks at: "$TXT_COL2$(date)$TXT_COL_RST
echo "Finished updating networks at: "$(date) >> $LOGFILE

