import os
import sys
from pynput.keyboard import Controller, Key
from selenium import webdriver
from selenium.webdriver.remote.remote_connection import LOGGER
import websockets
import asyncio
import logging

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")

    return os.path.join(base_path, relative_path)


def bin2str(bin):
    chars_bin = bin.split(" ")

    res = ""
    for char_bin in chars_bin:
        if not char_bin == "":
            res += chr(int(char_bin, 2))

    return res

def findex(prevO, currO):
    prev = prevO.lower()
    curr = currO.lower()

    len_prev = len(prev)
    len_curr = len(curr)
    for i in range(len_curr, 0, -1):
        tofind = curr[0:i]
        ind = prev.rfind(tofind)
        if ind != -1:
            silinecek = len_prev - len(tofind)
            return silinecek - ind, currO[ind + len(prev[ind:]) - silinecek:]

    return len_prev, currO


keybo = Controller()

def backSpace(times):
    for _ in range(times):
        keybo.press(Key.backspace)
        keybo.release(Key.backspace)


prev = ""
text = ""

async def main_cycle(ws,path):
    langs = ""
    with open(resource_path("favs"), "r") as favs:
        langs = favs.read()

    await ws.send(langs)
    try:
        while True:
            message = await ws.recv()
            messageHandler(message)
    except websockets.exceptions.ConnectionClosed:
        asyncio.get_event_loop().stop()



def messageHandler(message):

    global prev, text

    recieved = bin2str(message).split("?")
    type = recieved[0]


    if type == "RES":
        curr = recieved[1]
        final = bool(int(recieved[2]))

        if not final:
            temp = findex(prev, curr)
            backSpace(temp[0])
            keybo.type(temp[1])
            if temp[0] != 0:
                text = text[:-temp[0]]

            text += temp[1]
            prev = curr
        else:
            temp = findex(text, curr)
            backSpace(temp[0])
            keybo.type(temp[1])
            prev = ""
            text = ""
    elif type == "FAV":

        langs = recieved[1]
        favs = open(resource_path("favs"), 'w')
        favs.write(langs)
        favs.close()


def main():

    start_server = websockets.serve(main_cycle,'localhost',5000)
    LOGGER.setLevel(logging.WARNING)
    driver = webdriver.Chrome(resource_path("chromedriver.exe"))
    htmlpath = resource_path("index.html")
    driver.get("file://{}".format(htmlpath))

    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()
    driver.quit()


if __name__ == "__main__":
    main()
