#!/bin/bash
now="$(date +'%d/%m/%Y')"
curl https://cloudidea-77e8d.firebaseio.com/.json?format=export --output  "$(date +"%Y_%m_%d_%I_%M_%p")_backup.log"
printf "$now"