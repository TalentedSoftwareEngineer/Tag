<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IssueController;
use App\Http\Controllers\IssueStatusController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\MsgsDeleteController;
use App\Http\Controllers\WorkerMsgController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => 'web'], function () {
    Route::get('users/list', [UserController::class, 'list']);
    Route::get('me', [UserController::class, 'me']);

    Route::apiResource('issues', IssueController::class);
    Route::apiResource('messages', MessageController::class);
    Route::post('getMngerMessage', [
        MessageController::class,
        'getMngerMessage',
    ]);
    Route::get('getcount', [MessageController::class, 'getCount']);
    Route::post('msghiden', [MessageController::class, 'msgHiden']);
    Route::post('getReservationMsgs', [
        MessageController::class,
        'getReservationMsgs',
    ]);
    Route::post('updateSendDate', [MessageController::class, 'updateSendDate']);
    Route::apiResource('msgsdelete', MsgsDeleteController::class);
    Route::apiResource('staffs', StaffController::class);

    Route::post('workermessages', [
        WorkerMsgController::class,
        'getWorkerMsgs',
    ]);

    Route::get('issue-statuses/list', [IssueStatusController::class, 'list']);
    Route::apiResource('issue-statuses', IssueStatusController::class);
});
