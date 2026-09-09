// 협진 채팅 관련 쿼리

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getChatRoomListApi,
  getChatMessagesApi,
  sendChatMessageApi,
  markChatRoomReadApi,
} from '../../apis/caseApi';
import { mapChatRoom, mapChatMessage } from '../../mappers/chatMapper';

// status: undefined(전체) | 'IN_REVIEW' | 'COMPLETED'
export const useChatRoomListQuery = (status) =>
  useQuery({
    queryKey: ['chatRooms', status],
    queryFn: () => getChatRoomListApi(status).then((list) => list.map(mapChatRoom)),
  });

export const useChatMessagesQuery = (caseId, roomId) =>
  useQuery({
    queryKey: ['chatMessages', caseId, roomId],
    enabled: !!caseId && !!roomId,
    queryFn: () => getChatMessagesApi(caseId, roomId).then((data) => data.messages.map(mapChatMessage)),
  });

export const useSendChatMessageMutation = (caseId, roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => sendChatMessageApi(caseId, roomId, content),
    onSuccess: (msg) => {
      queryClient.setQueryData(['chatMessages', caseId, roomId], (old = []) => [
        ...old,
        mapChatMessage(msg),
      ]);
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    },
  });
};

// 채팅방 읽음 처리 (lastReadMessageId 생략 시 최신까지 전체 읽음)
export const useMarkChatRoomReadMutation = (roomId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lastReadMessageId) => markChatRoomReadApi(roomId, lastReadMessageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['hospitalDashboard'] });
    },
  });
};
