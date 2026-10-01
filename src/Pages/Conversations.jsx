import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import PageHeader from "../Components/UI/PageHeader";
import PageLoader from "../Components/UI/PageLoader";
import EmptyState from "../Components/UI/EmptyState";
import SearchInput from "../Components/UI/SearchInput";
import ContactCard from "../Components/Chat/ContactCard";
import api from "../Utils/api";
import { getErrorMessage } from "../Utils/helpers";
import { cardClass } from "../Utils/styles";

const Conversations = () => {
  const [contacts, setContacts] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/chats")
      .then((res) => setContacts(res.data.data))
      .catch((error) => {
        toast.error(getErrorMessage(error));
        setContacts([]);
      });
  }, []);

  if (!contacts) return <PageLoader />;

  const filtered = contacts.filter((contact) =>
    `${contact.name} ${contact.email} ${contact.role}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader eyebrow="Chat" title="Conversations" description="Click on someone from your organization to open a chat." />

      {contacts.length == 0 ? (
        <div className={cardClass}>
          <EmptyState icon={Users} title="No one to chat with yet" description="Other members of your organization will show up here." />
        </div>
      ) : (
        <>
          <div className="mb-6">
            <SearchInput value={search} onChange={setSearch} placeholder="Search people..." />
          </div>

          {filtered.length == 0 ? (
            <div className={cardClass}>
              <EmptyState icon={Users} title="No matches" description="Try a different name or email." />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((contact) => (
                <div key={contact._id} className={`${cardClass} p-1`}>
                  <ContactCard
                    contact={contact}
                    onClick={() => navigate(`/conversations/${contact._id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Conversations;
