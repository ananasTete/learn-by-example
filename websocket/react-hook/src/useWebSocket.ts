import { useCallback, useEffect, useRef, useState } from 'react';
import { useLatest, useUnmount } from 'ahooks';

type Options = {
  reconnectLimit?: number;
  reconnectInterval?: number;
  manual?: boolean;
  onOpen?: (event: WebSocketEventMap['open'], instance: WebSocket) => void;
  onClose?: (event: WebSocketEventMap['close'], instance: WebSocket) => void;
  onMessage?: (event: WebSocketEventMap['message'], instance: WebSocket) => void;
  onError?: (event: WebSocketEventMap['error'], instance: WebSocket) => void;
};

export type Result = {
  message?: WebSocketEventMap['message'];
  sendMessage: WebSocket['send'];
  disconnect: () => void;
  connect: () => void;
};

function useWebSocket(socketUrl: string, options: Options = {}): Result {
  const { reconnectLimit = 3, reconnectInterval = 3 * 1000, manual = false, onOpen, onClose, onMessage, onError } = options;

  const onOpenRef = useLatest(onOpen);
  const onCloseRef = useLatest(onClose);
  const onMessageRef = useLatest(onMessage);
  const onErrorRef = useLatest(onError);

  const websocketRef = useRef<WebSocket>();
  const [message, setMessage] = useState<WebSocketEventMap['message']>();

  const reconnectTimesRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const reconnect = () => {
    // 还有剩余次数并且连接没有打开，则进行重连
    if (reconnectTimesRef.current < reconnectLimit && websocketRef.current?.readyState != WebSocket.OPEN) {
      // onerror 和 onclose 都会触发 reconnect，保证只有一次重连

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      reconnectTimerRef.current = setTimeout(() => {
        connectWs();
        reconnectTimesRef.current++;
      }, reconnectInterval);
    }
  };

  const connectWs = () => {
    // 避免在用户手动连接时存在一个重连计时器
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    // 确保用户在手动连接时关闭之前的连接
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    const ws = new WebSocket(socketUrl);

    // 连接错误
    ws.onerror = (event) => {
      if (websocketRef.current !== ws) {
        return;
      }
      reconnect();
      onErrorRef.current?.(event, ws);
    };

    // 连接成功
    ws.onopen = (event) => {
      if (websocketRef.current !== ws) {
        return;
      }
      onOpenRef.current?.(event, ws);
      // 重置重连次数
      reconnectTimesRef.current = 0;
    };

    // 连接关闭
    ws.onclose = (event) => {
      onCloseRef.current?.(event, ws);

      // 在服务端关闭时尝试重连，在旧连接关闭时不需要重连
      if (websocketRef.current === ws) {
        reconnect();
      }
    };

    // 收到消息
    ws.onmessage = (message: WebSocketEventMap['message']) => {
      if (websocketRef.current !== ws) {
        return;
      }
      onMessageRef.current?.(message, ws);
      setMessage(message);
    };

    websocketRef.current = ws;
  };

  const sendMessage: WebSocket['send'] = (message) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(message);
    } else {
      throw new Error('WebSocket disconnected');
    }
  };

  const disconnect = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }

    reconnectTimesRef.current = reconnectLimit;
    websocketRef.current?.close();
    websocketRef.current = undefined;
  };

  useEffect(() => {
    if (!manual && socketUrl) {
      connectWs();
    }
  }, [socketUrl, manual]);

  useUnmount(() => {
    disconnect();
  });

  return {
    message,
    sendMessage: useCallback(sendMessage, []),
    disconnect: useCallback(disconnect, []),
    connect: useCallback(connectWs, []),
  };
}

export default useWebSocket;
