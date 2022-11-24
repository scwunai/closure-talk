import { MouseEventHandler } from "react";
import ChatItem from "../../model/ChatItem";
import { ArknightsChatItemType } from "../../model/props/ArknightsProps";
import RendererProps from "../RendererProps";
import "./Arknights.css";


function make_akn_header(content: string, click: () => void, contextMenu: MouseEventHandler) {
  return (
    <div className="akn-header">
      <div className="akn-header-left">DIALOGUE</div>
      <div className="akn-header-title" onClick={click} onContextMenu={contextMenu}>
        {content}
        <div className="akn-header-title-deco akn-header-title-deco-1"></div>
        <div className="akn-header-title-deco akn-header-title-deco-2"></div>
        <div className="akn-header-title-deco akn-header-title-deco-3"></div>
        <div className="akn-header-title-deco akn-header-title-deco-4"></div>
      </div>
      <div className="akn-header-right"></div>
    </div>
  );
}

function is_stamp(item: ChatItem): boolean {
  return item.arknights.type === ArknightsChatItemType.Image && !item.content.startsWith("data:image");
}

export default function ArknightsRenderer(props: RendererProps) {
  const chat = props.chat;
  let headerCounter = 0;

  const renderItem = (idx: number) => {
    const item = chat[idx];
    const itemProps = item.arknights;
    const type = itemProps.type;

    if (type === ArknightsChatItemType.SectionTitle) {
      // make part counter increasing sequentially
      headerCounter++;
      const title = item.content.trim().length === 0 ? `Part.${headerCounter.toString().padStart(2, "0")}` : item.content;
      return make_akn_header(title, () => props.click(item), (ev) => props.contextMenuCallback(ev.nativeEvent, item));
    }

    const avatarUrl = item.char?.character.get_url(item.char!.img) || "resources/renderer/ak/doctor.webp";

    let content: string | JSX.Element = "Not implemented";
    if (type === ArknightsChatItemType.Text) {
      content = (
        <div className="akn-content-text">{item.content}</div>
      );
    }
    else if (type === ArknightsChatItemType.Image) {
      content = <img
        alt={"Image"}
        src={item.content}
        className={is_stamp(item) ? "akn-stamp" : ""}
      />;
    }

    return (
      <div className="akn-item">
        <div className="akn-avatar">
          <img alt={`Avatar of ${item.char?.character.get_short_name("en") || "player"}`} src={avatarUrl}></img>
        </div>
        <div className="akn-content" onClick={() => props.click(item)} onContextMenu={(ev) => props.contextMenuCallback(ev.nativeEvent, item)}>
          {content}
        </div>
      </div>
    );
  };

  const chatBgColor = "#231b14";

  return (
    <div style={{
      backgroundColor: chatBgColor,
      minHeight: "100%",
    }}>
      <div id="chat-area" style={{
        backgroundColor: chatBgColor,
        paddingTop: "16px",
        paddingBottom: "16px",
      }}>
        {chat.map((_, idx) => (
          <div key={idx} className="chat-item">
            {idx !== props.insertIdx ? null :
              <div data-html2canvas-ignore className="akn-insert-indicator"></div>
            }
            {renderItem(idx)}
          </div>
        ))}
      </div>
    </div>
  );
}