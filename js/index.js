/**
 * 生成服务器新闻
 */
$.getJSON("data/json/serverNotice.json", function (data) {
    var count = 0; // 初始化计数器

    $.each(data, function (index, item) {
        if (count >= 5) {
            return false; // 超过5个元素时跳出循环
        }

        var html;
        if (index % 2 === 0) {
            // 偶数元素结构
            html = `
            <div class="row d-flex align-items-center">
                <!-- cover -->
                <div class="image col-lg-6">
                    <img src="${item.cover}" alt="${item.title}" class="img-fluid">
                </div>
                <div class="text col-lg-6">
                    <div class="icon">
                        <img src="${item.icon}" alt="${item.title}" class="img-fluid">
                    </div>
                    <h4>${item.title}</h4>
                    <p>
                        描述:
                        <br>
                        ${item.describe}
                        <br>
                        <i class="fas fa-clock"></i>${item.time}
                    </p>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-shadow btn-gradient">查看详情</a>
                </div>
            </div>
            `;
        } else {
            // 奇数元素结构
            html = `
            <div class="row d-flex align-items-center">
                <div class="text col-lg-6 order-2 order-lg-1">
                    <div class="icon">
                        <img src="${item.icon}" alt="${item.title}" class="img-fluid">
                    </div>
                    <h4>${item.title}</h4>
                    <p>
                        ${item.describe}
                        <br>
                        <i class="fa-solid fa-clock"></i>${item.time}
                    </p>
                    <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-shadow btn-gradient">查看详情</a>
                </div>
                <!-- cover -->
                <div class="image col-lg-6 order-1 order-lg-2">
                    <img src="${item.cover}" alt="${item.title}" class="img-fluid">
                </div>
            </div>
            `;
        }
        // 插入到容器中
        $('#notice .container').append(html);

        count++; // 每生成一个元素，计数器加1
    });
});


/**
 * 生成友链
 */
$.getJSON("data/json/friends.json", function (data) {
    $.each(data, function (index, item) {
        // 使用正则表达式匹配并提取域名部分
        var domain = item.link.replace(/^https?:\/\//, '');
        domain = domain.replace(/\/$/, '');
        var html = `
        <div class="item col-lg-4 col-md-6">
            <div class="icon">
                <img src="/img/friends/${domain}.gif" alt="${item.name}" class="img-fluid img-rounded img-circle">
            </div>
            <h3 class="h5">${item.name}</h3>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-shadow btn-gradient">进入</a>
        </div>
        `;
        $('#friends .grid').append(html);
    });
});


/**
 * 生成玩家评论
 */
$.getJSON("data/json/playerComments.json", function (data) {
    $('.player-comments-container').trigger('destroy.owl.carousel'); // 销毁原有的carousel
    $('.player-comments-container').html(''); // 清空原有的内容
    $.each(data, function (index, item) {
        var html = `
        <div class="item-holder">
            <div class="item">
                <div class="avatar">
                    <img src="${item.avatar}" alt="${item.name}" class="img-fluid">
                </div>
                <div class="text">
                    <div class="quote">
                        <img src="img/svg/quote.svg" alt="svg" class="img-fluid">
                    </div>
                    <p>
                        ${item.content}
                    </p>
                    <strong class="name">
                        ${item.name}
                    </strong>
                </div>
            </div>
        </div>
        `;
        $('.player-comments-container').append(html);
    });
    $('.player-comments-container').owlCarousel({
        loop: true,
        margin: 10,
        dots: false,
        nav: true,
        smartSpeed: 700,
        navText: [
            "<i class='fa fa-angle-left'></i>",
            "<i class='fa fa-angle-right'></i>"
        ],
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: false,
                dots: true
            },
            600: {
                items: 1,
                nav: true
            },
            1000: {
                items: 2,
                nav: true,
                loop: false
            }
        }
    });
});