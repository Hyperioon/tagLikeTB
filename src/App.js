import React, { Component, useState } from "react";
import DropDown from "./tools.js"
import "./App.less";


const TagList = (props) => {

  const listItems = props.data.map((item) => {
    if (item.done) {
      return <li className="tag-wrap" key={item.thing}>
        <span id="tag" className={"tagColor" + item.color}>
          {item.thing}
          <a className="close" id={item.thing} onClick={props.changeDone} ></a>
        </span>
      </li>
    }
  });
  return (
    <ul className="tag-ul">{listItems}</ul>
  );
}

const Tag = (props) => {
  const [editdata, setEditdata] = useState(null)
  const [data, setData] = useState(
    [
      { done: true, thing: 'sleep', color: '1' },
      { done: false, thing: 'play', color: '2' },
      { done: true, thing: 'drink', color: '3' },
      { done: true, thing: 'eat', color: '4' },
      { done: true, thing: 'swim', color: '5' },
      { done: true, thing: 'run', color: '6' },
    ],
  )
  const [view, setView] = useState(1)
  const [itemText, setItemText] = useState('')

  //标签列表在浏览器本地存储，为了展示效果暂时注释掉
  // componentDidMount () {//  加载前就执行的函数
  //   this.setState(() => ({
  //       data: JSON.parse(localStorage.getItem('data')) || []
  //   }))
  // }
  // componentDidUpdate() {
  //   localStorage.setItem('data', JSON.stringify(this.state.data));
  // }

  const changeToTable = e => {
    setView(1)
  }

  const changeToEdit = e => {
    e.stopPropagation();//点击编辑，阻止事件冒泡！
    setItemText(e.target.getAttribute("id"))
    setView(3)
  }

  const changeToCreate = e => {
    console.log("222");
    setView(2)
  }

  const changeDone = (e) => {
    e.stopPropagation();
    let index = e.target.getAttribute("id");
    data.map(item => {
      if (item.thing === index) {
        item.done = !item.done;
        return;
      }
      return item;
    })
    setData(data)
  }

  const handleCreate = e => {
    e.persist();
    let a = {};
    let flag = true;
    a.done = true;
    a.thing = e.target.value;
    a.color = e.target.getAttribute("colornum");
    console.log(a.thing);
    if (a.thing.length == 0) {
      flag = !flag;
    }
    data.forEach(item => {
      if (item.thing === a.thing) {
        flag = !flag;
      }
    })
    if (flag) {
      data.push(a);
      setData(data)
      setView(1)
    } else if (a.thing.length == 0) {
      alert("不能为空 ！");
    }
    else {
      alert("标签名称已存在！");
    }
  }

  const handleEdit = e => {
    // edit (delete and change) 判断是编辑完成还是删除按钮 执行两种操作
    e.persist();
    var origin = e.target.getAttribute("origin");//谁调用handleEdit函数，谁就通过e.target来获取它自己身上的origin
    let which = e.target.getAttribute("id");
    if (which == "change") {
      let a = {};
      let flag = true;
      let appearAgain = false;
      a.done = true;
      a.thing = e.target.value;
      a.color = e.target.getAttribute("colornum");
      console.log(a.thing);
      if (a.thing.length === 0) {
        flag = false;
      }
      data.forEach(item => {
        if (item.thing === a.thing && a.thing !== origin) {
          flag = false;
          appearAgain = true;
        };
      })
      console.log(flag);
      if (appearAgain != true) {
        data.forEach(item => {
          if (item.thing === origin && a.thing.length != 0) {
            item.thing = a.thing;
            item.color = a.color;
          };
        })
      }
      if (flag) {
        setData(data)
        setView(1)
      } else if (a.thing.length == 0) {
        alert("不能为空 ！");
      }
      else if (appearAgain) {
        alert("标签名称已存在！");
      } else {
        setView(1)
      }
    } else if (which == "delete") {
      var index;
      console.log(origin + "-666");
      data.forEach(item => {
        console.log(item.thing);
        if (item.thing === origin) {
          index = data.indexOf(item);
          console.log("OK");
        }
      })
      data.splice(index, 1);
      setData(data)
      setView(1)
    }

  }

    return (
      <div className="Container">
        <TagList
          changeDone={changeDone}
          data={data}
        />
        <DropDown
          changeDone={changeDone}
          handleEdit={handleEdit}
          handleCreate={handleCreate}
          changeToTable={changeToTable}
          changeToEdit={changeToEdit}
          changeToCreate={changeToCreate}
          view={view}
          data={data}
          itemText={itemText}
        />
      </div>
    );
}

export default Tag;