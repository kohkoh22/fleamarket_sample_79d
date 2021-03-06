$(function () {
  // カテゴリーオプション作成(セレクトタグ内のoption)
  function buildOption(category) {
    let html =
      `<option value="${category.id}" >${category.name}</option>`
    return html;
  }
  // 子階層カテゴリーの表示作成
  function appendChildrenBox(insertHTML){
    let buildChildSelect = '';
    buildChildSelect =
      `<select class="Form__input" id="children_category" name="item[category_id]">
        <option value>選択してください</option>
        ${insertHTML}
      </select>`
    $('.categoryList').append(buildChildSelect);
  }
  // 孫階層カテゴリーの表示作成
  function appendGrandchildrenBox(insertHTML){
    let buildGrandchildrenSelect = '';
    buildGrandchildrenSelect =
      `<select class="Form__input" id="grandchildren_category" name="item[category_id]">
        <option>選択してください</option>
        ${insertHTML}
      </select>`
    $('.categoryList').append(buildGrandchildrenSelect);
  }
  // 親階層カテゴリー選択後のイベント
  $('#parent_category').on('change', function () {
    //選択された親カテゴリーの名前を取得
    let parentId = $(this).val();
    //親階層カテゴリーが初期値でないとき発火
    if (parentId != "") {
      // 子階層カテゴリーを持ってくるためにajax通信
      $.ajax({
        url: '/items/get_category_children',
        type: 'GET',
        data: { parent_id: parentId },
        dataType: 'json'
      })
      // 親階層カテゴリーが初期値でないときの成功動作
      .done(function (children) {
        //親が変更された時、子以下を削除する
        $('#children_category').remove(); 
        $('#grandchildren_category').remove(); 
        //追加するHTMLの入れ物を作る
        let insertHTML = '';
        //配列childrenの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
        $.each(children, function (i, child) {
          insertHTML += buildOption(child)
        });
        appendChildrenBox(insertHTML);
      })
      // 親階層カテゴリーが初期値でないときの失敗動作
      .fail(function () {
        alert('カテゴリー取得に失敗しました');
      })
    } else {
      // 親階層カテゴリーが初期値になった時、子以下を削除する
      // 子階層の表示削除
      $('#children_category').remove(); 
      // 孫階層の表示削除
      $('#grandchildren_category').remove(); 
    }
  });
  // 子階層カテゴリー選択後のイベント
  $('.categoryList').on('change', '#children_category', function () {
    let childId = $(this).val();
    if (childId != "") {
      $.ajax({
        url: '/items/get_category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })
      // 親階層カテゴリーが初期値でないときの成功動作
      .done(function (grandchildren) {
        // 子階層が変更された時、孫階層を削除する
        $('#grandchildren_category').remove();
        // 孫階層カテゴリーがない場合は.doneの後の処理が動かないようにする
        if (grandchildren.length !== 0) {
          //子が変更された時、孫要素を削除する
          //追加するHTMLの入れ物を作る
          let insertHTML = '';
          //配列grandchildrenの中身一つ一つを取り出し、HTMLに変換したものを入れ物に足し合わせる
          $.each(grandchildren, function (i, grandchildren) {
            insertHTML += buildOption(grandchildren)
          });
          appendGrandchildrenBox(insertHTML);
        }
      })
        // 親階層カテゴリーが初期値でないときの失敗動作
      .fail(function () {
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      // 孫階層が初期値の時孫階層の表示削除
      $('#grandchildren_category').remove(); 
    }
  })
});
