from cryptography.fernet import Fernet
import configparser

if __name__ == "__main__":

    config = configparser.ConfigParser()

    key = Fernet.generate_key()
    passwd = input("Set password:").encode()
    f = Fernet(key)
    encrypted = f.encrypt(passwd)

    config["ACTIVATION"] = {"activation1": key.decode(),
                            "activation2": encrypted.decode(),
                            "activation3":""}

    with open("activation.ini","w") as configfile:
        config.write(configfile)


    print("Completed.")