import React, { Component,useState } from "react";
import "./App.less";
import { Input, Popover, Button } from "antd";

const ColorSelect = (props) => {
  const colorItems = [];
  for (let i = 1; i <= 6; i++) {
    colorItems.push(
      <li
        key={i}
        colornum={i}
        id={"color-circle"}
        className={"color" + i}
        onClick={props.choose}
      >
        <span
          className="gougou"
          colornum={i}
          style={{ visibility: props.colornum == i ? "visible" : "hidden" }}
        >
          √
        </span>
      </li>
    );
  }

  return (
    <ul
      className="tag-ul"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {colorItems}
    </ul>
  );
};

const TagCreate = (props) => {
  const [editingItemText, setEditingItemText] = useState('');
  const [colornum, setColornum] = useState(1);


  const choose = (e) => {
    e.stopPropagation();
    let colornums = e.target.getAttribute("colornum");
    setColornum(colornums)
    console.log(colornum);
  };

  const changeItem = (e) => {
    e.persist();
    setEditingItemText(e.target.value);
    // this.setState({ editingItemText: e.target.value }, () => {
    //   console.log(this.state.editingItemText);
    // });
    //setState是异步的
  };

    return (
      <div>
        <a onClick={props.changeToTable} className="icon">
          &lt;
        </a>
        <Input
          type="text"
          placeholder="标签名称"
          value={editingItemText} //放入需要编辑的标签的原始值
          onChange={changeItem}
        />
        <ColorSelect
          choose={choose}
          colornum={colornum}
        ></ColorSelect>
        <button
          type="primary"
          className="btn"
          style={{ width: "100%", marginBottom: "15px" }}
          onClick={props.handleCreate}
          value={editingItemText}
          colornum={colornum}
        >
          创建
        </button>
        {/* 这个地方不要用Antd的Button组件！！因为涉及到获取input值会需要及时的更新，而Antd的Button组件可能因为复杂的动画效果产生的延迟会影响value值的传递！ */}
      </div>
    );
}

const TagEdit = (props) =>  {
  const [editingItemText, setEditingItemText] = useState(props.itemText);
  const [origin, setOrigin] = useState(props.itemText);
  const [colornum, setColornum] = useState(1);

  const choose = (e) => {
    e.stopPropagation();
    let colornums = e.target.getAttribute("colornum");
    setColornum(colornums)
  };

  const changeItem = (e) => {
    setEditingItemText(e.target.value)
    console.log(editingItemText);
  };

    return (
      <div>
        <a onClick={props.changeToTable} className="icon">
          &lt;
        </a>
        <Input
          type="text"
          placeholder="标签名称"
          value={editingItemText} //放入需要编辑的标签的原始值
          onChange={changeItem}
        />
        <ColorSelect
          choose={choose}
          colornum={colornum}
        ></ColorSelect>
        <button
          className="btn btn-danger"
          id="delete"
          style={{ width: "45%", marginBottom: "15px" }}
          onClick={props.handleEdit}
          origin={origin}
          value={editingItemText}
        >
          删除
        </button>
        <button
          type="primary"
          id="change"
          className="btn"
          style={{ width: "45%", float: "right" }}
          onClick={props.handleEdit}
          origin={origin}
          value={editingItemText}
          colornum={colornum}
        >
          完成
        </button>
      </div>
    );
}

const  TagSearch =(props) =>  {

    return (
      <div>
        <Input
          type="text"
          placeholder="搜索"
          style={{ marginBottom: "15px", width: "80%" }}
          value={props.filterText}
          onChange={props.handleFilterTextChange}
        />
        <Button className="plus" onClick={props.changeToCreate}>
          <span className="plus-span">+</span>
        </Button>
      </div>
    );
}

const TagTable =(props) =>  {
    const filterText = props.filterText;
    const listItems = [];

    props.data.forEach((item) => {
      if (item.thing.indexOf(filterText) === -1) {
        //返回-1则表示没有匹配项
        return;
      }
      listItems.push(
        <li
          className="tag-tb"
          key={item.thing}
          id={item.thing}
          onClick={props.changeDone}
        >
          <span
            className={"tagColor" + item.color}
            style={{
              height: "0",
              width: "0",
              fontSize: "22px",
              marginRight: "30px",
            }}
          >
            • &nbsp;
          </span>
          {item.thing}
          <div
            className="edit"
            style={{ marginLeft: "auto", zIndex: "10" }}
            id={item.thing}
            onClick={props.changeToEdit}
          >
            编辑
          </div>{" "}
          {/*点击“编辑”时，要用到阻止冒泡（stopPropagation()），以防触发changeDone事件。*/}
          <div
            onClick={props.changeDone}
            id={item.thing}
            style={{
              visibility: item.done ? "visible" : "hidden",
              marginRight: "10px",
              fontWeight: "800",
            }}
          >
            √
          </div>
        </li>
      );
    });
    if (listItems.length <= 0) {
      console.log("没有");
      listItems.push(
        <li className="tag-tb" key style={{ color: "#a9a9a9" }}>
          {" "}
          没有结果{" "}
        </li>
      );
    }
    return <ul>{listItems}</ul>;
}

const DropDown =(props) =>  {
  const [filterText,setFilterText] = useState('')
  const [visible,setVisible] = useState(false)

  const hide = () => {
    setVisible(false)
  };

  const handleVisibleChange = (visible) => {
    setVisible(visible)
  };

  const handleFilterTextChange = (e) => {
    let filterText = e.target.value;
    setFilterText(filterText)
  };

    if (props.view == 1) {
      return (
        <Popover
          content={
            <div style={{ width: "250px" }}>
              <TagSearch
                filterText={filterText}
                handleFilterTextChange={handleFilterTextChange}
                changeToCreate={props.changeToCreate}
              ></TagSearch>

              <TagTable
                filterText={filterText}
                data={props.data}
                changeDone={props.changeDone}
                changeToEdit={props.changeToEdit}
              ></TagTable>
            </div>
          }
          title="所有标签"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="link">添加</Button>
        </Popover>
      );
    } else if (props.view == 2) {
      return (
        <Popover
          content={
            <div style={{ width: "250px" }}>
              <a
                onClick={hide}
                className="icon"
                style={{
                  float: "right",
                  marginRight: "7px",
                  marginLeft: "30px",
                }}
              >
                ×
              </a>
              <TagCreate
                changeToTable={props.changeToTable}
                handleCreate={props.handleCreate}
              ></TagCreate>
            </div>
          }
          title="新增标签"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="link">添加标签</Button>
        </Popover>
      );
    } else if (props.view == 3) {
      return (
        <Popover
          content={
            <div style={{ width: "250px" }}>
              <a
                onClick={hide}
                className="icon"
                style={{
                  float: "right",
                  marginRight: "7px",
                  marginLeft: "30px",
                }}
              >
                ×
              </a>
              <TagEdit
                changeToTable={props.changeToTable}
                handleEdit={props.handleEdit}
                itemText={props.itemText}
              ></TagEdit>
            </div>
          }
          title="修改标签"
          trigger="click"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
          <Button type="link">添加标签</Button>
        </Popover>
      );
    }
  }

export default DropDown;
