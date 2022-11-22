import jQuery from 'jquery';

window.jQuery = jQuery;
window.$ = jQuery;


(function ($) {
    let body = $('body'),
        players = [];

    $('.add-player').on('click', function () {
        addPlayers($('.player-add-name').val());

        console.log(players);
    });

    $('.heal-all').on('click', function () {
        $('.players-role__player').removeClass('death');

        players.forEach((player) => {
            player.status = true;
        });

        console.log(players)
    });

    $('.distribute-roles').on('click', function () {
        if (players.length > 6) {
            let roles = generateRole(players.length);

            players.forEach((player) => {
                player.role = String(roles.splice(Math.floor(Math.random() * roles.length), 1));
            });

            document.querySelectorAll('.players-role__player .player-role-select').forEach((item, key)=> {
                item.setAttribute('data-role', players[key].role);
            });

            console.log(players)
        }
    });

    $('.reset-roles').on('click', function () {
        $('.player-role p').attr('data-role', 'Мирный');

        players.forEach((player) => {
            player.role = "Мирный";
        });

        console.log(players)
    });

    body.on('blur', '.players-role__player input[name="name"]', function () {
        let playerId = $(this).closest('.players-role__player').data('id');

        setParameter(playerId, 'name', $(this).val())

        console.log(players)
    });

    body.on('click', '.player-role-select', function () {
        $(this).closest('.player-role').find('.player-role__list').slideToggle()
        $(this).closest('.players-role__player').siblings().find('.player-role__list').slideUp()
    });

    body.on('click', '.player-role__list li', function () {
        let role = $(this).data('role'),
            playerId = $(this).closest('.players-role__player').data('id');

        $(this).closest('.player-role').find('p').attr('data-role', role)
        $(this).closest('.player-role').find('.player-role__list').slideUp()

        setParameter(playerId, 'role', role);

        console.log(players)
    });

    body.on('click', '.player-death', function () {
        let playerId = $(this).closest('.players-role__player').data('id');

        $(this).closest('.players-role__player').addClass('death');

        setParameter(playerId, 'status', false);

        console.log(players)
    });

    body.on('click', '.delete-player', function () {
        let playerWrap = $(this).closest('.players-role__player');

        playerWrap.remove();

        deletePlayer(playerWrap.data('id'));

        console.log(players)
    });

    $(document).on('mouseup', function (event) {
        let role_list = $(".player-role__list");

        if (!role_list.is(event.target) &&
            role_list.has(event.target).length === 0) {
            $('.player-role__list').slideUp()
        }
    });

    function addPlayers(name, role, status) {
        let player = new function () {
                this.id = players.length + 1;
                this.name = (name === undefined || name === "") ? `Игрок${players.length + 1}` : name;
                this.role = (role === undefined) ? "Мирный" : role;
                this.status = (status === undefined) ? true : status;
                this.vote = false;
            },
            htmlPlayer = `<li class="players-role__player" data-id="${player.id}">
                        <input type="text" name="name" value="${player.name}">
                        <div class="player-role">
                            <p data-role="${player.role}" class="player-role-select"></p>
                            <ul class="player-role__list">
                                <li data-role="Мирный">Мирный</li>
                                <li data-role="Mафия">Mафия</li>
                                <li data-role="Дон">Дон</li>
                                <li data-role="Комиcсар">Комисар</li>
                                <li data-role="Доктор">Доктор</li>
                                <li data-role="Куртизанка">Куртизанка</li>
                                <li data-role="Маньяк">Маньяк</li>
                            </ul>
                        </div>
                        <div class="player-death">💀</div>
                        <div class="delete-player">+</div>
                    </li>`;

        players.push(player);

        $('.players-role__player-list').append(htmlPlayer);
    }

    function deletePlayer(playerId) {
        players.forEach((player, key) => {
            if (player.id === playerId) {
                players.splice(key, 1);
            }
        });
    }

    function setParameter(playerId, parameter, value) {
        players.forEach((player) => {
            if (player.id === playerId) {
                player[parameter] = value;
            }
        });
    }

    //Добавить проверку на количество ролей
    function selectRole(role, playerId) {
        players.forEach((player) => {
            if (player.id === playerId) {
                player.role = role;
            }
        });
    }

    function generateRole(amountPlayers) {
        let roles = ["Доктор", "Комисар"],
            mafiaPlayer = (amountPlayers < 9) ? Math.floor(amountPlayers / 3) : Math.floor(amountPlayers / 3) - 1;

        if (amountPlayers >= 8) {
            roles.push("Дон");
        }
        if (amountPlayers >= 9) {
            roles.push("Куртизанка");
        }
        if (amountPlayers >= 12) {
            roles.push("Маньяк");
        }

        pushRole(roles, "Мафия", mafiaPlayer);

        let peacefulPlayer = amountPlayers - roles.length;

        pushRole(roles, "Мирный", peacefulPlayer);

        // function recursion push role
        function pushRole(roles, role, amount) {
            if (amount === 0) {
                return roles;
            } else {
                roles.push(role);
                return pushRole(roles, role, --amount);
            }
        }

        return roles;
    }

})(window.jQuery);