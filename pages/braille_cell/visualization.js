import {
  AppShell,
  Header,
  TextInput,
  Text,
  MediaQuery,
  Burger,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons";

import mqtt from "mqtt";
import { useEffect, useState } from "react";

export default function BrailleCellVisualization() {
  const [opened, setOpened] = useState(false);
  const [enteredText, setEnteredText] = useState("");
  const [receivedText, setReceivedText] = useState([]);
  const [mqttClient, setMqttClient] = useState();

  const textUpdated = (event) => {
    setEnteredText(event.target.value);
  };

  const sendText = () => {
    if (!enteredText || !mqttClient) {
      return;
    }

    // https://stackoverflow.com/a/1967132/7450617
    for (let i = 0; i < enteredText.length; i++) {
      console.log("Sending ", enteredText.charAt(i));
      const thisChar = enteredText.charAt(i);
      mqttClient.publish("vissible/char/show", thisChar);
    }
  };

  useEffect(() => {
    // connection option
    const options = {
      // clean: true, // retain session
      // connectTimeout: 4000, // Timeout period
      // // Authentication information
      clientId: "vissible_cpanel",
      // username: 'emqx_test',
      // password: 'emqx_test',
    };

    const client = mqtt.connect("http://192.168.166.223:9001", options);
    setMqttClient(client);

    client.on("connect", function () {
      client.subscribe("vissible/char/resp", function (err) {
        if (!err) {
          // client.publish("vissible/char/show", "Subscribed");
        } else {
          console.warn(err);
        }
      });
    });

    client.on("message", function (topic, message) {
      // message is Buffer
      // console.log("RECEIVED", message.toString());
      const received = {
        msg: message.toString(),
        id: Math.round(Math.random() * 1000),
      };
      const updatedArray = [...receivedText, received];
      console.log(updatedArray, receivedText);
      setReceivedText(updatedArray);
      // client.end();
    });
  }, []);

  return (
    <AppShell
      header={
        <Header height={60} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                mr="xl"
              />
            </MediaQuery>

            <Text>VISSible Visualization</Text>
          </div>
        </Header>
      }
    >
      <div className="h-full space-x-2">
        <section className="flex gap-2 items-end">
          <div className="grow">
            <TextInput
              placeholder="Enter Text to Send"
              label="Text"
              onChange={textUpdated}
              withAsterisk
            />
          </div>

          <ActionIcon
            variant="filled"
            size="lg"
            color="blue"
            onClick={sendText}
          >
            <IconBrandTelegram size={16} />
          </ActionIcon>
        </section>
        <section className="flex flex-col gap-2 items-end mt-2">
          <div className="w-full">
            {receivedText.map((item) => (
              <Text key={item.id}>
                Shown <span className="text-blue-500">{item.msg}</span>
              </Text>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
