/**
 * Bogey
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the GNU GENERAL PUBLIC LICENSE (Version 3)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://www.gnu.org/licenses/gpl.html
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to red331@mail.ru so we can send you a copy immediately.
 *
 * Module stringutils is a part of PhantomJS framework - Bogey.
 *
 * @package Bogey
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 * @copyright Copyright (c) 2013 Selihov Sergei Stanislavovich.
 * @license http://www.gnu.org/licenses/gpl.html GNU GENERAL PUBLIC LICENSE (Version 3)
 *
 */

/**
 * Utilities module.
 *
 * @subpackage utils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Documents the stringutils module.
 *
 * Following module contains common string manipulation methods.
 *
 * @subpackage stringutils
 * @author Selihov Sergei Stanislavovich <red331@mail.ru>
 */

/**
 * Method that generates random string (recursive internal function).
 *
 * @access private
 *
 * @param int usrLength length of the string
 * @param string usrCur current string for internal use only
 *
 * @return string random string
 *
 */

function genRandStringRec(usrLength, usrCur)
{
    usrCur = usrCur ? usrCur : '';
    return usrLength ? genRandStringRec(--usrLength, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + usrCur) : usrCur;
}

exports.genRandStringRec = genRandStringRec;

