import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { UserX } from "lucide-react";
import PageLoader from "../Components/UI/PageLoader";
import EmptyState from "../Components/UI/EmptyState";
import ChatBox from "../Components/Chat/ChatBox";
import api from "../Utils/api";
import { getErrorMessage } from "../Utils/helpers";
import { cardClass, secondaryButton } from "../Utils/styles";

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState(null);

  // No single-user endpoint for chats, so find the contact in the chats list
  useEffect(() => {
    api.get("/api/chats")
      .then((res) => setContacts(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error));
        setContacts([]);
      });
  }, []);


  if (!contacts) return <PageLoader />;

  const contact = contacts.find((item) => item._id == id);
  const goBack = () => navigate("/conversations");

  if (!contact) {
    return (
      <div className={cardClass}>
        <EmptyState
          icon={UserX}
          title="Conversation not found"
          description="This person isn't available to chat with."
          action={<button onClick={goBack} className={secondaryButton}>Back to conversations</button>}
        />
      </div>
    );
  }

  return <ChatBox key={contact._id} contact={contact} onBack={goBack} />;
};

export default Chat;
