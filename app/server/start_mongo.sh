#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl start mongod


systemctl status mongod
