import { useState } from "react"


const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];





function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}> {children}</button>
  )
}

function App() {
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [friends, setFriends] = useState(initialFriends);
  const [seletedFreind, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(show => !show)
    setSelectedFriend(null);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((currSelected) => currSelected?.id === friend.id ? null : friend);
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends(friends => friends.map(friend => friend.id === seletedFreind.id ? { ...friend, balance: friend.balance + value } : friend))
    setSelectedFriend(null)
  }
  return (
    <div className="app">
      <div className="sidebar">

        <FriendsList friends={friends} onSelection={handleSelection} seletedFreind={seletedFreind} />

        {
          showAddFriend &&
          <FormAddFriend onAddFriend={handleAddFriend} />
        }

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>

      </div>
      {
        seletedFreind &&
        <FormSplitBill
          seletedFreind={seletedFreind}
          onSplitBill={handleSplitBill}
          key={seletedFreind.id}
        />
      }
    </div>
  )
}


function FriendsList({ friends, onSelection, seletedFreind }) {

  return (
    <ul>
      {friends.map(friend =>
        <Friend friend={friend}
          key={friend.id}
          onSelection={onSelection}
          seletedFreind={seletedFreind} />
      )}
    </ul>
  )
}


function Friend({ friend, onSelection, seletedFreind }) {

  const isSelected = seletedFreind?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {
        friend.balance < 0 &&
        <p className="red">You owe {friend.name} {friend.balance}$</p>
      }
      {
        friend.balance > 0 &&
        <p className="green">{friend.name} owes you {friend.balance}$</p>
      }
      {
        friend.balance === 0 &&
        <p>you and {friend.name} are even</p>
      }
      <Button onClick={() => onSelection(friend)}>{isSelected ? "Close" : "Select"}</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const fixedImgUrl = "https://i.pravatar.cc/48?u="
  const [img, setImg] = useState(fixedImgUrl);


  function handleAddFriend(e) {
    e.preventDefault();

    if (!name || !img) return
    let id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${img}${id}`,
      balance: 0,
      id
    };

    setName("");
    setImg(fixedImgUrl);
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>🧑🏽‍🤝‍👩🏻Friend Name</label>
      <input type="text"
        value={name}
        onChange={e => setName(e.target.value)} />

      <label>📷Image URL</label>
      <input type="text"
        value={img}
        onChange={e => setImg(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}



function FormSplitBill({ seletedFreind, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {seletedFreind.name}</h2>

      <label>💰 Bill Value</label>
      <input type="text" value={bill} onChange={e => setBill(Number(e.target.value))} />

      <label>🧍‍♂️ your expense</label>
      <input type="text"
        value={paidByUser}
        onChange={e => setPaidByUser(Number(e.target.value) > bill ?
          paidByUser : Number(e.target.value))} />

      <label>🧑🏽‍🤝‍👩🏻 {seletedFreind.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the Bill</label>
      <select value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{seletedFreind.name}</option>
      </select>

      <Button onClick={handleSubmit}>Split Bill</Button>
    </form>
  )
}

export default App
