<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('users', 'name') && !Schema::hasColumn('users', 'fullName')) {
            Schema::table('users', function (Blueprint $table) {
                $table->renameColumn('name', 'fullName');
            });
        }

        if (!Schema::hasColumn('users', 'gender')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('gender')->nullable()->after('fullName');
            });
        }

        if (!Schema::hasColumn('users', 'phoneNumber')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('phoneNumber', 20)->nullable()->after('gender');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('fullName', 'name');
            $table->dropColumn(['gender', 'phoneNumber']);
        });
    }
};
