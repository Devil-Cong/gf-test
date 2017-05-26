(function () {
    var album = new iAlbum({
        animation: true,
        data: albumMock,
        introduce: true,
        line: 3
    });

    var members = new iMembers({
        el: '#member-lists',
        animation: true,
        delay: 200,
        title: '优秀员工',
        subtitle: '兴趣爱好',
        data: memberMock,
        click: function (item) {
            album.show('name', item.name);
        }
    });
    var members = new iMembers({
        el: '#member-lists',
        animation: true,
        delay: 200,
        title: '优秀员工',
        subtitle: '兴趣爱好',
        data: memberMock,
        click: function (item) {
            album.show('name', item.name);
        }
    });
})();
